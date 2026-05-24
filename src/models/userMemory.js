const users = [

  {
    id: "1",
    name: "Administrador",
    email: "admin@unisabana.edu.co",
    password: "...",
    role: "admin",

    isSeller: false,
    sellerInfo: null,
    rating: null,
    totalSales: 0,
    reviews: [],

    cart: [],

    // 🔥 NUEVO
    purchases: []
  }

];

module.exports = users;