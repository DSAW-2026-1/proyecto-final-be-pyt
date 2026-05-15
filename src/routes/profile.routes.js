const express = require("express");

const auth = require("../middleware/auth");

const {
  getProfile,
  becomeSeller
} = require("../controllers/profile.controller");

const router = express.Router();

// obtener perfil
router.get("/", auth, getProfile);

// convertirse en vendedor
router.post(
  "/become-seller",
  auth,
  becomeSeller
);

module.exports = router;