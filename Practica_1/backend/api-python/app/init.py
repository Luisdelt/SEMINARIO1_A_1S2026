from flask import Flask, jsonify
from flask_cors import CORS
from app.config import Config
from routes.user_routes import user_bp
from routes.movies_routes import movie_bp

def create_app():
    app = Flask(__name__)
    app.secret_key = Config.SECRET_KEY
    CORS(app)

    @app.route('/')
    def index():
        return jsonify({"message": "UP"})
    app.register_blueprint(user_bp)
    app.register_blueprint(movie_bp)

    return app