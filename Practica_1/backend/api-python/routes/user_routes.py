import hashlib
from flask import Blueprint, request, jsonify, session
from app.database import get_connection
from app.s3_client import upload_profile_photo, get_public_url

user_bp = Blueprint('user', __name__, url_prefix='/user')

def md5(text):
    """Genera el hash MD5 de una cadena de texto."""
    return hashlib.md5(text.encode()).hexdigest()

@user_bp.route('/register', methods=['POST'])
def register():
    """
    Registra un nuevo usuario.
    Body (multipart/form-data):
        correo, nombre_completo, contrasena, confirmar_contrasena, foto (opcional)
    """
    correo              = request.form.get('correo', '').strip()
    nombre_completo     = request.form.get('nombre_completo', '').strip()
    contrasena          = request.form.get('contrasena', '')
    confirmar = request.form.get('confirmar_contrasena', '')
    foto                = request.files.get('foto')

    if not correo or not nombre_completo or not contrasena:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    if contrasena != confirmar:
        return jsonify({"error": "Las contraseñas no coinciden"}), 400

    foto_key = None
    if foto:
        import uuid
        ext      = foto.filename.rsplit('.', 1)[-1].lower()
        filename = f"{uuid.uuid4().hex}.{ext}"
        foto_key = upload_profile_photo(foto, filename)
        foto_url = get_public_url(foto_key)

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id_usuario FROM Usuario WHERE correo = %s", (correo,))
            if cursor.fetchone():
                return jsonify({"error": "El correo ya está registrado"}), 409
            print(foto_url)
            cursor.execute(
                """
                INSERT INTO Usuario (correo, nombre_completo, contrasena, foto_perfil)
                VALUES (%s, %s, %s, %s)
                """,
                (correo, nombre_completo, md5(contrasena), foto_url)
            )
        conn.commit()
        return jsonify({"message": "Usuario registrado exitosamente"}), 201
    finally:
        conn.close()


@user_bp.route('/login', methods=['POST'])
def login():
    """
    Autentica al usuario.
    Body (JSON): { "correo": "...", "contrasena": "..." }
    """
    data       = request.get_json() or {}
    correo     = data.get('correo', '').strip()
    contrasena = data.get('contrasena', '')

    if not correo or not contrasena:
        return jsonify({"error": "Correo y contraseña son requeridos"}), 400

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM Usuario WHERE correo = %s AND contrasena = %s",
                (correo, md5(contrasena))
            )
            usuario = cursor.fetchone()

        if not usuario:
            return jsonify({"error": "Credenciales incorrectas"}), 401

        session['id_usuario'] = usuario['id_usuario']
        session['nombre']     = usuario['nombre_completo']

        foto_url = get_public_url(usuario['foto_perfil']) if usuario.get('foto_perfil') else None

        return jsonify({
            "message":  "Login exitoso",
            "usuario": {
                "id":             usuario['id_usuario'],
                "correo":         usuario['correo'],
                "nombre_completo": usuario['nombre_completo'],
                "foto_perfil":    foto_url
            }
        }), 200
    finally:
        conn.close()


@user_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({"message": "Sesión cerrada exitosamente"}), 200



@user_bp.route('/edit', methods=['PUT'])
def edit():
    """
    Edita nombre y/o foto de perfil del usuario.
    Requiere la contraseña actual para confirmar identidad.
    Body (multipart/form-data):
        id_usuario, contrasena_actual, nombre_completo (opcional), foto (opcional)
    """
    id_usuario       = request.form.get('id_usuario')
    contrasena_actual = request.form.get('contrasena_actual', '')
    nuevo_nombre     = request.form.get('nombre_completo', '').strip()
    foto             = request.files.get('foto')

    if not id_usuario or not contrasena_actual:
        return jsonify({"error": "id_usuario y contrasena_actual son requeridos"}), 400

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT * FROM Usuario WHERE id_usuario = %s AND contrasena = %s",
                (id_usuario, md5(contrasena_actual))
            )
            usuario = cursor.fetchone()
            if not usuario:
                return jsonify({"error": "Contraseña incorrecta"}), 401

            updates = {}
            if nuevo_nombre:
                updates['nombre_completo'] = nuevo_nombre
            if foto:
                import uuid
                ext      = foto.filename.rsplit('.', 1)[-1].lower()
                filename = f"{uuid.uuid4().hex}.{ext}"
                updates['foto_perfil'] = upload_profile_photo(foto, filename)

            if not updates:
                return jsonify({"message": "No hay cambios que guardar"}), 200

            set_clause = ", ".join(f"{k} = %s" for k in updates)
            cursor.execute(
                f"UPDATE Usuario SET {set_clause} WHERE id_usuario = %s",
                (*updates.values(), id_usuario)
            )
        conn.commit()
        return jsonify({"message": "Perfil actualizado exitosamente"}), 200
    finally:
        conn.close()


@user_bp.route('/playlist/<int:id>', methods=['GET'])
def get_playlist(id):
    """
    Retorna la lista de reproducción del usuario, ordenada de más reciente a más antigua.
    """
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    p.id_pelicula,
                    p.titulo,
                    p.director,
                    p.anio_estreno,
                    p.poster,
                    p.url_contenido,
                    p.estado,
                    lr.fecha_agregado
                FROM Lista_Reproduccion lr
                JOIN Pelicula p ON lr.id_pelicula = p.id_pelicula
                WHERE lr.id_usuario = %s
                ORDER BY lr.fecha_agregado DESC
                """,
                (id,)
            )
            playlist = cursor.fetchall()

        for pelicula in playlist:
            if pelicula.get('poster'):
                pelicula['poster_url'] = get_public_url(pelicula['poster'])

        return jsonify({"playlist": playlist}), 200
    finally:
        conn.close()


@user_bp.route('/playlist/add', methods=['POST'])
def add_to_playlist():
    """
    Agrega una película a la lista del usuario.
    Body (JSON): { "id_usuario": 1, "id_pelicula": 3 }
    """
    data        = request.get_json() or {}
    id_usuario  = data.get('id_usuario')
    id_pelicula = data.get('id_pelicula')

    if not id_usuario or not id_pelicula:
        return jsonify({"error": "id_usuario e id_pelicula son requeridos"}), 400

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "SELECT estado FROM Pelicula WHERE id_pelicula = %s",
                (id_pelicula,)
            )
            pelicula = cursor.fetchone()
            if not pelicula:
                return jsonify({"error": "Película no encontrada"}), 404
            if pelicula['estado'] != 'Disponible':
                return jsonify({"error": "La película no está disponible aún"}), 400

            cursor.execute(
                "INSERT IGNORE INTO Lista_Reproduccion (id_usuario, id_pelicula) VALUES (%s, %s)",
                (id_usuario, id_pelicula)
            )
        conn.commit()
        return jsonify({"message": "Película agregada a tu lista de reproducción"}), 201
    finally:
        conn.close()



@user_bp.route('/playlist/remove', methods=['DELETE'])
def remove_from_playlist():
    """
    Elimina una película de la lista del usuario.
    Body (JSON): { "id_usuario": 1, "id_pelicula": 3 }
    """
    data        = request.get_json() or {}
    id_usuario  = data.get('id_usuario')
    id_pelicula = data.get('id_pelicula')

    if not id_usuario or not id_pelicula:
        return jsonify({"error": "id_usuario e id_pelicula son requeridos"}), 400

    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                "DELETE FROM Lista_Reproduccion WHERE id_usuario = %s AND id_pelicula = %s",
                (id_usuario, id_pelicula)
            )
        conn.commit()
        return jsonify({"message": "Película eliminada de tu lista"}), 200
    finally:
        conn.close()