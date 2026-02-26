function notFound(req, res) {
  res.status(404).json({ ok: false, message: "Ruta no encontrada" });
}

function errorHandler(err, req, res, next) {
  console.error(err);
  
  const status = err.status || 500;

  res.status(status).json({
    ok: false,
    message: err.message || "Error interno",
  });
}

module.exports = { notFound, errorHandler };