const pool = require("../config/db");

async function getAllMovies() {
  const [rows] = await pool.query(
    "SELECT id_pelicula, titulo, director, anio_estreno, poster, url_contenido, estado FROM Pelicula ORDER BY id_pelicula ASC"
  );
  return rows;
}

async function findMovieById(id_pelicula) {
  const [rows] = await pool.query("SELECT * FROM Pelicula WHERE id_pelicula = ? LIMIT 1", [id_pelicula]);
  return rows[0] || null;
}

module.exports = { getAllMovies, findMovieById };