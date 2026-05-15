const express = require("express");
const auth = require("../middleware/auth");

const router = express.Router();

// ruta protegida
router.get("/profile", auth, (req, res) => {
  res.json({
    message: "Acceso permitido ✅",
    user: req.user
  });
});

module.exports = router;