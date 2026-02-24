from flask import Blueprint,jsonify

user_bp = Blueprint('user', __name__, url_prefix='/user')

user_bp.route('/register', methods=['POST'])
def register():
    return jsonify({"message": "Usuario registrado exitosamente"})

user_bp.route('/login', methods=['POST'])
def login():
    return jsonify({"message": "Usuario logueado exitosamente"})

user_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({"message": "Usuario deslogueado exitosamente"})

user_bp.route('/edit', methods=['PUT'])
def edit():
    return jsonify({"message": "Usuario editado exitosamente"})

user_bp.route('/playlist/<int:id>', methods=['GET'])
def get_playlist(id):
    return jsonify({"message": f"Playlist obtenida exitosamente para el usuario con ID {id}"})

user_bp.route('/playlist/add/<int:id>', methods=['POST'])
def add_to_playlist(id):
    return jsonify({"message": f"Pelicula agregada a playlist exitosamente para el usuario con ID {id}"})