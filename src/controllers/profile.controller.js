const users = require("../models/userMemory");

// ===============================
// OBTENER PERFIL PRIVADO
// ===============================
const getProfile = (req, res) => {

  const user = users.find(u => String(u.id) === String(req.user.id));

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const { password, ...userSafe } = user;

  return res.json({
    ...userSafe,
    rating: user.rating || "Nuevo",
    totalSales: user.totalSales || 0,
    isSeller: user.isSeller || false,
    sellerInfo: user.sellerInfo || null
  });

};


// ===============================
// CONVERTIRSE EN VENDEDOR
// ===============================
const becomeSeller = (req, res) => {

  const {
    publicName,
    phone,
    faculty,
    description
  } = req.body;

  const user = users.find(
    u => String(u.id) === String(req.user.id)
  );

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  // 🔥 VALIDAR CAMPOS
  if (!publicName || !phone || !faculty) {
    return res.status(400).json({
      error: "Todos los campos son obligatorios"
    });
  }

  // 🔥 SI YA ES VENDEDOR
  if (user.isSeller) {
    return res.status(400).json({
      error: "Ya eres vendedor"
    });
  }

  user.isSeller = true;

  user.sellerInfo = {
    publicName,
    phone,
    faculty,
    description: description || ""
  };

  // 🔥 inicializar datos importantes si no existen
  user.totalSales = user.totalSales || 0;
  user.reviews = user.reviews || [];
  user.notifications = user.notifications || [];

  const { password, ...userSafe } = user;

  res.json({
    message: "Ahora eres vendedor ✅",
    user: userSafe
  });

};


// ===============================
// PERFIL PUBLICO DE VENDEDOR
// ===============================
const getPublicProfile = (req, res) => {

  const { id } = req.params;

  const user = users.find(
    u => String(u.id) === String(id)
  );

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  // 🔥 SOLO DATOS PUBLICOS
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,

    isSeller: user.isSeller,

    sellerInfo: user.sellerInfo || null,

    totalSales: user.totalSales || 0,

    rating:
      user.totalSales >= 5
        ? user.rating || 5
        : "Nuevo",

    reviews: user.reviews || []
  });

};


module.exports = {
  getProfile,
  becomeSeller,
  getPublicProfile
};