from flask import Blueprint, jsonify

movie_bp = Blueprint('movie', __name__, url_prefix='/movie')

movie_bp.route('/exploration', methods=['GET'])
def movie_exploration():
    return jsonify({"message": "Exploración de películas exitosa"})