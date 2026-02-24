from flask import Blueprint, jsonify
from app.database import get_connection
from app.s3_client import get_public_url

movie_bp = Blueprint('movie', __name__, url_prefix='/movie')

#─────────────────────────────────────
@movie_bp.route('/exploration', methods=['GET'])
def movie_exploration():
    """
    Retorna el catálogo completo de películas.
    Para cada película con poster, incluye la URL pública de S3.
    """
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id_pelicula,
                    titulo,
                    director,
                    anio_estreno,
                    poster,
                    url_contenido,
                    estado
                FROM Pelicula
                ORDER BY titulo ASC
                """
            )
            peliculas = cursor.fetchall()

        for pelicula in peliculas:
            if pelicula.get('poster'):
                pelicula['poster_url'] = get_public_url(pelicula['poster'])

        return jsonify({"peliculas": peliculas}), 200
    finally:
        conn.close()