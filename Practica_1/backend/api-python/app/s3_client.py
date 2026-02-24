import boto3
from app.config import Config

S3_ENABLED = bool(Config.AWS_ACCESS_KEY_ID and Config.AWS_SECRET_ACCESS_KEY)

def get_s3_client():
    if not S3_ENABLED:
        raise RuntimeError("AWS S3 no configurado: define AWS_ACCESS_KEY_ID y AWS_SECRET_ACCESS_KEY en el .env")
    return boto3.client(
        "s3",
        aws_access_key_id     = Config.AWS_ACCESS_KEY_ID,
        aws_secret_access_key = Config.AWS_SECRET_ACCESS_KEY,
        region_name           = Config.AWS_REGION
    )

def upload_profile_photo(file_obj, filename):
    if not S3_ENABLED:
        return None
    s3 = get_s3_client()
    key = f"fotos_perfil/{filename}"
    s3.upload_fileobj(file_obj, Config.S3_BUCKET_IMAGES, key,
                      ExtraArgs={"ContentType": file_obj.content_type})
    return key

def upload_movie_poster(file_obj, filename):
    if not S3_ENABLED:
        return None
    s3 = get_s3_client()
    key = f"fotos_publicas/{filename}"
    s3.upload_fileobj(file_obj, Config.S3_BUCKET_IMAGES, key,
                      ExtraArgs={"ContentType": file_obj.content_type})
    return key

def get_public_url(s3_key):
    return f"https://{Config.S3_BUCKET_IMAGES}.s3.{Config.AWS_REGION}.amazonaws.com/{s3_key}"
