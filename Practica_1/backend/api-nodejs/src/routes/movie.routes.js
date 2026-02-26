const router = require("express").Router();
const movieController = require("../controllers/movie.controller");

router.get("/exploration", movieController.getExploration);

module.exports = router;