const users = require("../models/userMemory");

// ==========================
// OBTENER HISTORIAL DE COMPRAS
// ==========================
const getPurchases = (req, res) => {

  const user = users.find(
    u => String(u.id) === String(req.user.id)
  );

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  res.json(user.purchases || []);

};

module.exports = {
  getPurchases
};