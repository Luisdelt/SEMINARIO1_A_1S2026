const healthRoutes = require("./routes/health.routes");
const movieRoutes = require("./routes/movie.routes");
const userRoutes = require("./routes/user.routes");

const { errorHandler, notFound } = require("./middlewares/error.middleware");

const express = require("express");
const cors = require("cors");
const app = express();

const allowedOrigins = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];

// CORS correcto para credentials
app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir llamadas sin origin (Postman/curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS no permitido para origin: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json()); // para login, playlist add/remove
app.use(express.urlencoded({ extended: true })); // por si llega x-www-form-urlencoded

app.use("/", healthRoutes);
app.use("/movie", movieRoutes);
app.use("/user", userRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;