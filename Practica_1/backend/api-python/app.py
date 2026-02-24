from app.init import create_app
from app.config import Config

app = create_app()

if __name__ == '__main__':
    app.run(
        debug=Config.DEBUG,
        host='0.0.0.0',
        port=Config.PORT
    )