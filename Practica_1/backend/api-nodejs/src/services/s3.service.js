const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");
const path = require("path");
const crypto = require("crypto");

function buildPublicUrl(key) {
  if (!key) return null;

  // Si ya viene como URL
  if (typeof key === "string" && key.startsWith("http")) return key;

  if (process.env.S3_PUBLIC_BASE_URL) {
    return `${process.env.S3_PUBLIC_BASE_URL}/${key}`;
  }

  const bucket = process.env.S3_BUCKET_IMAGES;
  const region = process.env.AWS_REGION;
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

function makeKey(prefix, originalname) {
  const ext = path.extname(originalname || "").toLowerCase() || ".jpg";
  const id = crypto.randomBytes(16).toString("hex");
  return `${prefix}/${id}${ext}`;
}

async function uploadProfilePhoto(file) {
  if (!file) return null;

  const bucket = process.env.S3_BUCKET_IMAGES;

  const prefix = process.env.S3_PROFILE_PREFIX || "fotos_perfil";

  const key = makeKey(prefix, file.originalname);

  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype || "application/octet-stream",
    })
  );

  return {
    key,
    url: buildPublicUrl(key),
  };
}

function getPublicUrl(key) {
  return buildPublicUrl(key);
}

module.exports = { uploadProfilePhoto, getPublicUrl };