const router = require("express").Router();

router.get("/", (req, res) => {
  res.status(200).json({ ok: true, message: "API en ejecución" });
});

module.exports = router;