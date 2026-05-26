const users = [

  // =========================
  // ADMIN POR DEFECTO
  // =========================
  {
    id: "1",
    name: "Administrador",
    email: "admin@unisabana.edu.co",

    // ⚠️ contraseña fake (solo para pruebas)
    password: "$2b$10$123456789123456789123uQ0W8X8X8X8X8X8X8X8X8X8X8",

    role: "admin",

    // =========================
    // VENDEDOR
    // =========================
    isSeller: false,
    sellerInfo: null,

    // =========================
    // CALIFICACIÓN
    // =========================
    rating: null,          // promedio
    totalSales: 0,         // ventas realizadas
    reviews: [],           // reseñas recibidas

    // =========================
    // CARRITO Y COMPRAS
    // =========================
    cart: [],
    purchases: [],

    // =========================
    // 🔔 NOTIFICACIONES
    // =========================
    notifications: []
  }

];

module.exports = users;