const md5 = require("md5");
const userService = require("../services/user.service");
const s3Service = require("../services/s3.service");

function getPublicUrl(keyOrUrl) {
  if (!keyOrUrl) return null;
  if (typeof keyOrUrl === "string" && keyOrUrl.startsWith("http")) return keyOrUrl;
  const bucket = process.env.S3_BUCKET_IMAGES;
  const region = process.env.AWS_REGION;
  return `https://${bucket}.s3.${region}.amazonaws.com/${keyOrUrl}`;
}

async function register(req, res, next) {
  try {
    const { correo, nombre_completo, contrasena, confirmar_contrasena } = req.body;

    if (!correo || !nombre_completo || !contrasena || !confirmar_contrasena) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }
    if (contrasena !== confirmar_contrasena) {
      return res.status(400).json({ error: "Las contraseñas no coinciden" });
    }

    const exists = await userService.findByEmail(correo);
    if (exists) return res.status(409).json({ error: "El correo ya está registrado" });

    let foto_perfil = null;

    if (req.file) {
      const uploaded = await s3Service.uploadProfilePhoto(req.file);
      foto_perfil = uploaded.key;
    }

    await userService.createUser({
      correo,
      nombre_completo,
      contrasena_md5: md5(contrasena),
      foto_perfil,
    });

    return res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (e) {
    next(e);
  }
}

async function login(req, res, next) {
  try {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).json({ error: "Correo y contraseña son requeridos" });
    }

    const user = await userService.findByEmail(correo);
    if (!user) return res.status(401).json({ error: "Credenciales incorrectas" });

    if (md5(contrasena) !== user.contrasena) {
      return res.status(401).json({ error: "Credenciales incorrectas" });
    }

    return res.json({
      message: "Login exitoso",
      usuario: {
        id: user.id_usuario,
        correo: user.correo,
        nombre_completo: user.nombre_completo,
        foto_perfil: getPublicUrl(user.foto_perfil),
      },
    });
  } catch (e) {
    next(e);
  }
}

async function logout(req, res) {
  return res.json({ message: "Sesión cerrada exitosamente" });
}

async function edit(req, res, next) {
  try {
    const { id_usuario, contrasena_actual, nombre_completo } = req.body;

    if (!id_usuario || !contrasena_actual) {
      return res.status(400).json({ error: "id_usuario y contrasena_actual son requeridos" });
    }

    const user = await userService.findById(id_usuario);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    if (md5(contrasena_actual) !== user.contrasena) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    let foto_perfil = user.foto_perfil;

    if (req.file) {
      const uploaded = await s3Service.uploadProfilePhoto(req.file);
      foto_perfil = uploaded.key; // ✅ guardar KEY
    }

    const ok = await userService.updateUser(id_usuario, {
      nombre_completo: nombre_completo?.trim() ? nombre_completo.trim() : user.nombre_completo,
      foto_perfil,
    });

    if (!ok) return res.status(500).json({ error: "No se pudo actualizar el usuario" });

    return res.json({ message: "Perfil actualizado exitosamente" });
  } catch (e) {
    next(e);
  }
}

module.exports = { register, login, logout, edit };