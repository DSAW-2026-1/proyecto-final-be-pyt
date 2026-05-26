const express = require("express");
const auth = require("../middleware/auth");

// controllers
const { getPurchases } = require("../controllers/user.controller");

const router = express.Router();

// ==========================
// HISTORIAL DE COMPRAS
// ==========================
router.get("/purchases", auth, getPurchases);

module.exports = router;