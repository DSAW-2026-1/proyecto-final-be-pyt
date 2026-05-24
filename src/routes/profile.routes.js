const express = require("express");
const router = express.Router();

const users = require("../models/userMemory");

// middleware auth
const auth = require("../middleware/auth");

router.get("/", auth, (req, res) => {

  const user = users.find(u => u.id == req.user.id);

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  res.json(user);
});

module.exports = router;