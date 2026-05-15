const users = [

  // ADMIN POR DEFECTO
  {
    id: "1",

    name: "Administrador",

    email: "admin@unisabana.edu.co",

    password:
      "$2b$10$123456789123456789123uQ0W8X8X8X8X8X8X8X8X8X8X8",

    role: "admin",

    isSeller: false,

    sellerInfo: null,

    rating: null,

    totalSales: 0,

    reviews: []
  }

];

module.exports = users;