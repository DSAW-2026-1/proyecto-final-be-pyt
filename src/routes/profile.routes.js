const express = require("express");

const router = express.Router();

// ===============================
// MIDDLEWARE
// ===============================
const auth = require("../middleware/auth");

// ===============================
// CONTROLLERS
// ===============================
const {
  getProfile,
  becomeSeller,
  getPublicProfile,
  getNotifications,
  getPurchases
} = require("../controllers/profile.controller");

// ===============================
// 👤 PERFIL PRIVADO
// ===============================
router.get("/", auth, getProfile);

// ===============================
// 🛍️ CONVERTIRSE EN VENDEDOR
// ===============================
router.post(
  "/become-seller",
  auth,
  becomeSeller
);

// ===============================
// 🌍 PERFIL PÚBLICO
// ===============================
router.get(
  "/public/:id",
  getPublicProfile
);

// ===============================
// 🔔 NOTIFICACIONES
// ===============================
router.get(
  "/notifications",
  auth,
  getNotifications
);

// ===============================
// 🧾 COMPRAS
// ===============================
router.get(
  "/purchases",
  auth,
  getPurchases
);

module.exports = router;