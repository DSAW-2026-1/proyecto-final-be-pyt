const express = require("express");
const router = express.Router();

// middleware auth
const auth = require("../middleware/auth");

// controllers
const {
  getProfile,
  becomeSeller,
  getPublicProfile
} = require("../controllers/profile.controller");

// ===============================
// 👤 PERFIL PRIVADO
// ===============================
router.get("/", auth, getProfile);

// ===============================
// 🛍️ CONVERTIRSE EN VENDEDOR
// ===============================
router.post("/become-seller", auth, becomeSeller);

// ===============================
// 🌍 PERFIL PÚBLICO
// ===============================
router.get("/public/:id", getPublicProfile);

module.exports = router;