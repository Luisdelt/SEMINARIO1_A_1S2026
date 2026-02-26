const playlistService = require("../services/playlist.service");
const movieService = require("../services/movie.service");

const s3Service = require("../services/s3.service");

async function getByUserId(req, res, next) {
  try {
    const { id } = req.params;
    const rows = await playlistService.getPlaylistByUserId(id);

    const playlist = rows.map((p) => ({
      id_pelicula: p.id_pelicula,
      titulo: p.titulo,
      director: p.director,
      anio_estreno: p.anio_estreno,
      poster: p.poster,
      poster_url: p.poster ? s3Service.getPublicUrl(p.poster) : null,
      url_contenido: p.url_contenido,
      estado: p.estado,
      fecha_agregado: p.fecha_agregado,
    }));

    return res.status(200).json({ playlist });
  } catch (e) {
    next(e);
  }
}

async function add(req, res, next) {
  try {
    const { id_usuario, id_pelicula } = req.body;
    if (!id_usuario || !id_pelicula) {
      return res.status(400).json({ ok: false, message: "id_usuario e id_pelicula son requeridos" });
    }

    const movie = await movieService.findMovieById(id_pelicula);
    if (!movie) return res.status(404).json({ ok: false, message: "Película no encontrada" });

    if (movie.estado !== "Disponible") {
      return res.status(400).json({ ok: false, message: "La película no está disponible" });
    }

    // Insert ignore (por unique uq_usuario_pelicula)
    await playlistService.addToPlaylist(id_usuario, id_pelicula);

    res.status(201).json({ ok: true, message: "Película agregada a la playlist" });
  } catch (e) {
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    const { id_usuario, id_pelicula } = req.body;
    if (!id_usuario || !id_pelicula) {
      return res.status(400).json({ ok: false, message: "id_usuario e id_pelicula son requeridos" });
    }

    await playlistService.removeFromPlaylist(id_usuario, id_pelicula);

    res.json({ ok: true, message: "Película eliminada de la playlist" });
  } catch (e) {
    next(e);
  }
}

module.exports = { getByUserId, add, remove };