const products = require("../models/productMemory");

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

  // solo dueño o admin
  if (
    product.seller !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      error: "No autorizado"
    });
  }

  Object.assign(product, req.body);

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

  // solo dueño o admin
  if (
    product.seller !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      error: "No autorizado"
    });
  }

  const index = products.indexOf(product);

  products.splice(index, 1);

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