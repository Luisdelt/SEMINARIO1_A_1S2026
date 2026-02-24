from flask import Flask, request, jsonify, session
from flask_cors import CORS
import os
from flask_mail import Mail, Message
import flask_login
from flask import session
from routes.user_routes import user_bp
from routes.movies_routes import movie_bp


app = Flask(__name__)
app.secret_key ="mi_clave_secreta"

app.route('/')
def index():
    return "Ya funciona la API"

app.register_blueprint(user_bp)
app.register_blueprint(movie_bp)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=3000)