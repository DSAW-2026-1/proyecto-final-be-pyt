const users = require("../models/userMemory");

// OBTENER PERFIL
const getProfile = (req, res) => {

  const user = users.find(
    u => u.id === req.user.id
  );

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  res.json(user);

};

// CONVERTIRSE EN VENDEDOR
const becomeSeller = (req, res) => {

  const {
    publicName,
    phone,
    faculty,
    description
  } = req.body;

  const user = users.find(
    u => u.id === req.user.id
  );

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  user.isSeller = true;

  user.sellerInfo = {
    publicName,
    phone,
    faculty,
    description
  };

  res.json({
    message: "Ahora eres vendedor ✅",
    user
  });

};

module.exports = {
  getProfile,
  becomeSeller
};