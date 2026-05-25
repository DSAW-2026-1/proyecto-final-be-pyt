const users = require("../models/userMemory");

// ===============================
// OBTENER PERFIL PRIVADO
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

  // 🔥 inicializar datos importantes
  user.totalSales = user.totalSales || 0;
  user.reviews = user.reviews || [];
  user.notifications = user.notifications || [];
  user.cart = user.cart || [];

  const { password, ...userSafe } = user;

  res.json({
    ...userSafe,

    rating:
      user.totalSales >= 5
        ? user.rating || 5
        : "Nuevo",

    totalSales: user.totalSales,

    isSeller: user.isSeller || false,

    sellerInfo: user.sellerInfo || null,

    reviews: user.reviews,

    notifications: user.notifications,

    cart: user.cart
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

  // 🔥 validar campos
  if (!publicName || !phone || !faculty) {

    return res.status(400).json({
      error: "Todos los campos son obligatorios"
    });

  }

  // 🔥 ya vendedor
  if (user.isSeller) {

    return res.status(400).json({
      error: "Ya eres vendedor"
    });

  }

  // 🔥 convertir
  user.isSeller = true;

  user.sellerInfo = {
    publicName,
    phone,
    faculty,
    description: description || ""
  };

  // 🔥 inicializar datos
  user.totalSales = user.totalSales || 0;
  user.reviews = user.reviews || [];
  user.notifications = user.notifications || [];
  user.cart = user.cart || [];

  const { password, ...userSafe } = user;

  res.json({
    message: "Ahora eres vendedor ✅",
    user: userSafe
  });

};


// ===============================
// PERFIL PUBLICO DEL VENDEDOR
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

  // 🔥 solo vendedores públicos
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

    joinedAt: user.createdAt || "Reciente"

  });

};


module.exports = {
  getProfile,
  becomeSeller,
  getPublicProfile
};