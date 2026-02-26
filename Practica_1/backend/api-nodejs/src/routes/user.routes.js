const router = require("express").Router();
const upload = require("../middlewares/upload.middleware");

const userController = require("../controllers/user.controller");
const playlistController = require("../controllers/playlist.controller");

router.post("/register", upload.single("foto"), userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.put("/edit", upload.single("foto"), userController.edit);

// playlist
router.get("/playlist/:id", playlistController.getByUserId);
router.post("/playlist/add", playlistController.add);
router.delete("/playlist/remove", playlistController.remove);

module.exports = router;