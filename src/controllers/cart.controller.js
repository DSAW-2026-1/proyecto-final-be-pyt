const users = require("../models/userMemory");

const products = require("../models/productMemory");

// VER CARRITO
const getCart = (req, res) => {

  const user = users.find(
    u => u.id === req.user.id
  );

  res.json(user.cart);

};

// AGREGAR PRODUCTO
const addToCart = (req, res) => {

  const { productId } = req.body;

  const user = users.find(
    u => u.id === req.user.id
  );

  const product = products.find(
    p => p.id === productId
  );

  if (!product) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  user.cart.push(product);

  res.json({
    message: "Producto agregado al carrito ✅",
    cart: user.cart
  });

};

// ELIMINAR PRODUCTO
const removeFromCart = (req, res) => {

  const { id } = req.params;

  const user = users.find(
    u => u.id === req.user.id
  );

  user.cart = user.cart.filter(
    p => p.id !== id
  );

  res.json({
    message: "Producto eliminado del carrito ✅",
    cart: user.cart
  });

};

// COMPRAR
const checkout = (req, res) => {

  const user = users.find(
    u => u.id === req.user.id
  );

  let total = 0;

  user.cart.forEach(product => {

    total += Number(product.price);

  });

  user.cart = [];

  res.json({
    message: "Compra realizada ✅",
    total
  });

};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  checkout
};