const express = require("express");
const router = express.Router();

const users = require("../models/userMemory");
const auth = require("../middleware/auth");

// 👤 VER PERFIL
router.get("/", auth, (req, res) => {

  const user = users.find(u => u.id == req.user.id);

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json(user);
});

// 🔥 VOLVERSE VENDEDOR
router.post("/become-seller", auth, (req, res) => {

  const user = users.find(u => u.id == req.user.id);

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  // ✅ convertir en vendedor
  user.isSeller = true;

  // opcional: info del vendedor
  user.sellerInfo = {
    description: req.body.description || "Nuevo vendedor"
  };

  res.json({
    message: "Ahora eres vendedor ✅",
    user
  });

});

module.exports = router;