const express = require("express");
const auth = require("../middleware/auth");

// 🔥 importar controller nuevo
const { getPurchases } = require("../controllers/user.controller");

const router = express.Router();

// ==========================
// PERFIL (YA LO TENÍAS)
// ==========================
router.get("/profile", auth, (req, res) => {
  res.json({
    message: "Acceso permitido ✅",
    user: req.user
  });
});

// ==========================
// HISTORIAL DE COMPRAS (NUEVO)
// ==========================
router.get("/purchases", auth, getPurchases);

module.exports = router;