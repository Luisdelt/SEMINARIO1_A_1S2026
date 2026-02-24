from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
from flask_mail import Mail, Message
import flask_login
from flask import session
from routes.user_routes import user_bp
from routes.movies_routes import movie_bp

def create_app():
    app = Flask(__name__)
    app.secret_key ="mi_clave_secreta"
    CORS(app)

    app.route('/')
    def index():
        return "Ya funciona la API"

    app.register_blueprint(user_bp)
    app.register_blueprint(movie_bp)

    return app