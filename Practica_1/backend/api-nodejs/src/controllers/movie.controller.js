const movieService = require("../services/movie.service");
const s3Service = require("../services/s3.service");

async function getExploration(req, res, next) {
  try {
    const rows = await movieService.getAllMovies();

    const peliculas = rows
      .sort((a, b) => (a.titulo || "").localeCompare(b.titulo || ""))
      .map((p) => ({
        id_pelicula: p.id_pelicula,
        titulo: p.titulo,
        director: p.director,
        anio_estreno: p.anio_estreno,
        poster: p.poster,
        poster_url: p.poster ? s3Service.getPublicUrl(p.poster) : null,
        url_contenido: p.url_contenido,
        estado: p.estado,
      }));

    return res.status(200).json({ peliculas });
  } catch (e) {
    next(e);
  }
}

module.exports = { getExploration };