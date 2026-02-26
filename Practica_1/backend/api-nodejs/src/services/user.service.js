const pool = require("../config/db");

async function findByEmail(correo) {
  const [rows] = await pool.query("SELECT * FROM Usuario WHERE correo = ? LIMIT 1", [correo]);
  return rows[0] || null;
}

async function findById(id_usuario) {
  const [rows] = await pool.query("SELECT * FROM Usuario WHERE id_usuario = ? LIMIT 1", [id_usuario]);
  return rows[0] || null;
}

async function createUser({ correo, nombre_completo, contrasena_md5, foto_perfil }) {
  const [result] = await pool.query(
    "INSERT INTO Usuario (correo, nombre_completo, contrasena, foto_perfil) VALUES (?, ?, ?, ?)",
    [correo, nombre_completo, contrasena_md5, foto_perfil]
  );
  return result.insertId;
}

async function updateUser(id_usuario, { nombre_completo, foto_perfil }) {
  const [result] = await pool.query(
    "UPDATE Usuario SET nombre_completo = ?, foto_perfil = ? WHERE id_usuario = ?",
    [nombre_completo, foto_perfil, id_usuario]
  );
  return result.affectedRows > 0;
}

module.exports = { findByEmail, findById, createUser, updateUser };