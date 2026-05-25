const express = require("express");
const router = express.Router();

const users = require("../models/userMemory");
const auth = require("../middleware/auth");

// ===============================
// 👤 VER PERFIL (PRIVADO)
// ===============================
router.get("/", auth, (req, res) => {

  const user = users.find(u => String(u.id) === String(req.user.id));

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  res.json(user);
});


// ===============================
// 🔥 VOLVERSE VENDEDOR
// ===============================
router.post("/become-seller", auth, (req, res) => {

  const user = users.find(u => String(u.id) === String(req.user.id));

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  // evitar duplicados
  if (user.isSeller) {
    return res.status(400).json({
      error: "Ya eres vendedor"
    });
  }

  user.isSeller = true;

  user.sellerInfo = {
    description: req.body.description || "Nuevo vendedor"
  };

  res.json({
    message: "Ahora eres vendedor ✅",
    user
  });
});


// ===============================
// 🌍 PERFIL PUBLICO (VENDEDOR)
// ===============================
router.get("/public/:id", (req, res) => {

  const { id } = req.params;

  const user = users.find(u => String(u.id) === String(id));

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    totalSales: user.totalSales,
    rating: user.rating || "Nuevo",
    sellerInfo: user.sellerInfo
  });
});

module.exports = router;