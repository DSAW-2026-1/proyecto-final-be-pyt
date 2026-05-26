const products = require("../models/productMemory");
const users = require("../models/userMemory");

// ===============================
// CREAR PRODUCTO
// ===============================
const createProduct = (req, res) => {

  const {
    title,
    price,
    description,
    category,
    condition,
    stock,
    image
  } = req.body;

  // 🔥 VALIDACIÓN BÁSICA (sin romper todo)
  if (!title || !price || !description) {
    return res.status(400).json({
      error: "Faltan campos obligatorios"
    });
  }

  const user = users.find(
    u => String(u.id) === String(req.user.id)
  );

  if (!user || !user.isSeller) {
    return res.status(403).json({
      error: "Debes ser vendedor"
    });
  }

  const newProduct = {
    id: Date.now().toString(),

    title,
    price: Number(price),
    description,
    category: category || "",
    condition: condition || "",
    stock: Number(stock) || 0,
    image: image || "",

    seller: String(req.user.id)
  };

  products.push(newProduct);

  res.json({
    message: "Producto creado ✅",
    product: newProduct
  });

};

// ===============================
// OBTENER PRODUCTOS
// ===============================
const getProducts = (req, res) => {

  const result = products.map(product => {

    const seller = users.find(
      u => String(u.id) === String(product.seller)
    );

    return {
      ...product,

      sellerInfo: seller ? {
        name: seller.name,
        rating: seller.rating || "Nuevo",
        email: seller.email
      } : null

    };

  });

  res.json(result);

};

// ===============================
// EDITAR PRODUCTO
// ===============================
const updateProduct = (req, res) => {

  const { id } = req.params;

  const product = products.find(
    p => String(p.id) === String(id)
  );

  if (!product) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  if (
    product.seller != req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      error: "No autorizado"
    });
  }

  // 🔥 actualizar SOLO lo que venga
  Object.keys(req.body).forEach(key => {

    if (req.body[key] !== undefined) {

      if (key === "price" || key === "stock") {
        product[key] = Number(req.body[key]);
      } else {
        product[key] = req.body[key];
      }

    }

  });

  res.json({
    message: "Producto actualizado ✅",
    product
  });

};

// ===============================
// ELIMINAR PRODUCTO
// ===============================
const deleteProduct = (req, res) => {

  const { id } = req.params;

  const product = products.find(
    p => String(p.id) === String(id)
  );

  if (!product) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  if (
    product.seller != req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      error: "No autorizado"
    });
  }

  // eliminar producto
  const index = products.findIndex(
    p => String(p.id) === String(id)
  );

  if (index !== -1) {
    products.splice(index, 1);
  }

  // limpiar carritos
  users.forEach(user => {

    if (user.cart && Array.isArray(user.cart)) {

      user.cart = user.cart.filter(
        p => String(p.id) !== String(id)
      );

    }

  });

  res.json({
    message: "Producto eliminado ✅"
  });

};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
};