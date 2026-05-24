const products = require("../models/productMemory");
const users = require("../models/userMemory");

// CREAR PRODUCTO
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

  // ❌ validar vendedor
  const user = users.find(u => u.id === req.user.id);

  if (!user.isSeller) {
    return res.status(403).json({
      error: "Debes ser vendedor para publicar"
    });
  }

  const newProduct = {
    id: Date.now().toString(),

    title,
    price,
    description,
    category,
    condition,
    stock,
    image,

    seller: req.user.id
  };

  products.push(newProduct);

  res.json({
    message: "Producto creado ✅",
    product: newProduct
  });

};

// OBTENER PRODUCTOS
const getProducts = (req, res) => {
  res.json(products);
};

// EDITAR PRODUCTO
const updateProduct = (req, res) => {

  const { id } = req.params;

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  // 🔐 solo dueño o admin
  if (
    product.seller !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      error: "No autorizado"
    });
  }

  // ✅ actualizar campos correctamente
  product.title = req.body.title ?? product.title;
  product.price = req.body.price ?? product.price;
  product.description = req.body.description ?? product.description;
  product.category = req.body.category ?? product.category;
  product.condition = req.body.condition ?? product.condition;
  product.stock = req.body.stock ?? product.stock;
  product.image = req.body.image ?? product.image;

  res.json({
    message: "Producto actualizado ✅",
    product
  });

};

// ELIMINAR PRODUCTO
const deleteProduct = (req, res) => {

  const { id } = req.params;

  const product = products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  // 🔐 solo dueño o admin
  if (
    product.seller !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      error: "No autorizado"
    });
  }

  // 🗑️ eliminar producto
  const index = products.indexOf(product);
  products.splice(index, 1);

  // 🔥 eliminar producto de TODOS los carritos
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