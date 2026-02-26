const pool = require("../config/db");

async function getPlaylistByUserId(id_usuario) {
  // Devuelve info de pelicula + fecha agregado, ordenado más reciente primero
  const [rows] = await pool.query(
    `
    SELECT 
      lr.id_lista,
      lr.fecha_agregado,
      p.id_pelicula,
      p.titulo,
      p.director,
      p.anio_estreno,
      p.poster,
      p.url_contenido,
      p.estado
    FROM Lista_Reproduccion lr
    INNER JOIN Pelicula p ON p.id_pelicula = lr.id_pelicula
    WHERE lr.id_usuario = ?
    ORDER BY lr.fecha_agregado DESC
    `,
    [id_usuario]
  );
  return rows;
}

async function addToPlaylist(id_usuario, id_pelicula) {
  // MySQL: INSERT IGNORE respeta uq_usuario_pelicula y no falla si ya existe
  await pool.query(
    "INSERT IGNORE INTO Lista_Reproduccion (id_usuario, id_pelicula) VALUES (?, ?)",
    [id_usuario, id_pelicula]
  );
}

async function removeFromPlaylist(id_usuario, id_pelicula) {
  await pool.query(
    "DELETE FROM Lista_Reproduccion WHERE id_usuario = ? AND id_pelicula = ?",
    [id_usuario, id_pelicula]
  );
}

module.exports = { getPlaylistByUserId, addToPlaylist, removeFromPlaylist };