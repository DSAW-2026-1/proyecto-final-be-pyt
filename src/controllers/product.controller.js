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

  // 🔥 VALIDAR CAMPOS OBLIGATORIOS
  if (
    !title ||
    !price ||
    !description ||
    !category ||
    !condition ||
    stock === undefined
  ) {
    return res.status(400).json({
      error: "Todos los campos son obligatorios"
    });
  }

  // 🔥 VALIDAR VENDEDOR
  const user = users.find(u => u.id === req.user.id);

  if (!user || !user.isSeller) {
    return res.status(403).json({
      error: "Debes ser vendedor para publicar"
    });
  }

  const newProduct = {
    id: Date.now().toString(),

    title,
    price: Number(price),
    description,
    category,
    condition,
    stock: Number(stock),
    image,

    seller: req.user.id
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
  res.json(products);
};

// ===============================
// EDITAR PRODUCTO
// ===============================
const updateProduct = (req, res) => {

  const { id } = req.params;

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  // 🔐 SOLO DUEÑO O ADMIN
  if (
    String(product.seller) !== String(req.user.id) &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      error: "No autorizado"
    });
  }

  const {
    title,
    price,
    description,
    category,
    condition,
    stock,
    image
  } = req.body;

  // 🔥 ACTUALIZAR SOLO SI VIENEN DATOS VÁLIDOS
  if (title) product.title = title;
  if (price !== undefined) product.price = Number(price);
  if (description) product.description = description;
  if (category) product.category = category;
  if (condition) product.condition = condition;
  if (stock !== undefined && stock >= 0) product.stock = Number(stock);
  if (image) product.image = image;

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

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  // 🔐 SOLO DUEÑO O ADMIN
  if (
    String(product.seller) !== String(req.user.id) &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      error: "No autorizado"
    });
  }

  // 🗑️ ELIMINAR PRODUCTO
  const index = products.findIndex(p => p.id === id);

  if (index !== -1) {
    products.splice(index, 1);
  }

  // 🔥 LIMPIAR DE TODOS LOS CARRITOS
  users.forEach(user => {
    user.cart = user.cart.filter(
      p => p.id !== id
    );
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