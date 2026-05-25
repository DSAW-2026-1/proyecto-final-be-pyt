const express = require("express");
const router = express.Router();

const users = require("../models/userMemory");
const auth = require("../middleware/auth");

// ===============================
// 👤 PERFIL PRIVADO
// ===============================
router.get("/", auth, (req, res) => {

  const user = users.find(u => String(u.id) === String(req.user.id));

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isSeller: user.isSeller,
    totalSales: user.totalSales,
    rating: user.rating || "Nuevo",
    sellerInfo: user.sellerInfo
  });
});


// ===============================
// 🔥 VOLVERSE VENDEDOR
// ===============================
router.post("/become-seller", auth, (req, res) => {

  const user = users.find(u => String(u.id) === String(req.user.id));

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  if (user.isSeller) {
    return res.status(400).json({ error: "Ya eres vendedor" });
  }

  user.isSeller = true;

  user.sellerInfo = {
    description: req.body.description || "Nuevo vendedor"
  };

  user.totalSales = user.totalSales || 0;

  return res.json({
    message: "Ahora eres vendedor ✅",
    user
  });
});


// ===============================
// 🌍 PERFIL PUBLICO
// ===============================
router.get("/public/:id", (req, res) => {

  const user = users.find(u => String(u.id) === String(req.params.id));

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    totalSales: user.totalSales || 0,
    rating: user.rating || "Nuevo",
    sellerInfo: user.sellerInfo || null
  });
});

module.exports = router;