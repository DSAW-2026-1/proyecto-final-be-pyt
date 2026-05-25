const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const { getProfile, becomeSeller, getPublicProfile } = require("../controllers/profile.controller");

// 👤 perfil privado
router.get("/", auth, getProfile);

// 🔥 volverse vendedor
router.post("/become-seller", auth, becomeSeller);

// 🌍 perfil público
router.get("/public/:id", getPublicProfile);

module.exports = router;