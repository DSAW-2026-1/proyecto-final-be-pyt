const users = require("../models/userMemory");

// ===============================
// 👤 PERFIL PRIVADO
// ===============================
const getProfile = (req, res) => {

  const user = users.find(
    u => String(u.id) === String(req.user.id)
  );

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  // ===============================
  // INICIALIZAR DATOS
  // ===============================
  user.totalSales = user.totalSales || 0;

  user.reviews = user.reviews || [];

  user.notifications = user.notifications || [];

  user.cart = user.cart || [];

  user.purchases = user.purchases || [];

  user.isSeller = user.isSeller || false;

  user.sellerInfo = user.sellerInfo || null;

  // ===============================
  // OCULTAR PASSWORD
  // ===============================
  const { password, ...safeUser } = user;

  res.json({

    ...safeUser,

    rating:
      user.totalSales >= 5
        ? user.rating || 5
        : "Nuevo"

  });

};

// ===============================
// 🛍️ CONVERTIRSE EN VENDEDOR
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

  // usuario no existe
  if (!user) {

    return res.status(404).json({
      error: "Usuario no encontrado"
    });

  }

  // validar campos
  if (
    !publicName ||
    !phone ||
    !faculty
  ) {

    return res.status(400).json({
      error: "Todos los campos son obligatorios"
    });

  }

  // ya vendedor
  if (user.isSeller) {

    return res.status(400).json({
      error: "Ya eres vendedor"
    });

  }

  // convertir
  user.isSeller = true;

  user.sellerInfo = {

    publicName,

    phone,

    faculty,

    description: description || ""

  };

  // inicializar
  user.totalSales = user.totalSales || 0;

  user.reviews = user.reviews || [];

  user.notifications = user.notifications || [];

  user.cart = user.cart || [];

  user.purchases = user.purchases || [];

  const { password, ...safeUser } = user;

  res.json({

    message: "Ahora eres vendedor ✅",

    user: safeUser

  });

};

// ===============================
// 🌍 PERFIL PÚBLICO
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

  // solo vendedores
  if (!user.isSeller) {

    return res.status(400).json({
      error: "Este usuario no es vendedor"
    });

  }

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

    reviews: user.reviews || [],

    joinedAt:
      user.createdAt || "Reciente"

  });

};

// ===============================
// 🔔 NOTIFICACIONES
// ===============================
const getNotifications = (req, res) => {

  const user = users.find(
    u => String(u.id) === String(req.user.id)
  );

  if (!user) {

    return res.status(404).json({
      error: "Usuario no encontrado"
    });

  }

  user.notifications =
    user.notifications || [];

  res.json(user.notifications);

};

// ===============================
// 🧾 COMPRAS
// ===============================
const getPurchases = (req, res) => {

  const user = users.find(
    u => String(u.id) === String(req.user.id)
  );

  if (!user) {

    return res.status(404).json({
      error: "Usuario no encontrado"
    });

  }

  user.purchases =
    user.purchases || [];

  res.json(user.purchases);

};

// ===============================
// EXPORTS
// ===============================
module.exports = {

  getProfile,

  becomeSeller,

  getPublicProfile,

  getNotifications,

  getPurchases

};