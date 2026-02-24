import os
from pathlib import Path
from dotenv import load_dotenv
_ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=_ENV_PATH, override=True)

class Config:
    SECRET_KEY  = os.getenv("FLASK_SECRET_KEY", "clave_secreta_por_defecto")
    DEBUG       = os.getenv("FLASK_DEBUG", "True") == "True"
    PORT        = int(os.getenv("FLASK_PORT", 3000))
    DB_HOST     = os.getenv("DB_HOST")
    DB_PORT     = int(os.getenv("DB_PORT", 3306))
    DB_NAME     = os.getenv("DB_NAME", "catalogo_cine")
    DB_USER     = os.getenv("DB_USER")
    DB_PASSWORD = os.getenv("DB_PASSWORD")
    AWS_ACCESS_KEY_ID     = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION            = os.getenv("AWS_REGION", "us-east-1")
    S3_BUCKET_IMAGES      = os.getenv("S3_BUCKET_IMAGES")
    S3_BUCKET_WEB         = os.getenv("S3_BUCKET_WEB")