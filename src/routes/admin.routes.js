const express = require("express");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const router = express.Router();

router.get(
  "/dashboard",
  auth,
  admin,
  (req, res) => {

    res.json({
      message: "Bienvenido administrador 🔥"
    });

  }
);

module.exports = router;