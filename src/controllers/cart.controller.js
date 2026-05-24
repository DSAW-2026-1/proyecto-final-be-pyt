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

  // ❌ producto no existe
  if (!product) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  // ❌ no comprar su propio producto
  if (product.seller === req.user.id) {
    return res.status(403).json({
      error: "No puedes comprar tu propio producto"
    });
  }

  // ❌ sin stock
  if (product.stock <= 0) {
    return res.status(400).json({
      error: "Producto sin stock"
    });
  }

  // 🔢 cuántos ya tiene en el carrito
  const countInCart = user.cart.filter(
    p => p.id === product.id
  ).length;

  // ❌ excede stock
  if (countInCart >= product.stock) {
    return res.status(400).json({
      error: "No hay suficiente stock"
    });
  }

  // ✅ agregar al carrito
  user.cart.push(product);

  res.json({
    message: "Producto agregado al carrito ✅",
    cart: user.cart
  });

};

// ELIMINAR PRODUCTO DEL CARRITO
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

// COMPRAR (CHECKOUT)
const checkout = (req, res) => {

  const user = users.find(
    u => u.id === req.user.id
  );

  let total = 0;

  for (let item of user.cart) {

    const product = products.find(
      p => p.id === item.id
    );

    // ❌ producto eliminado
    if (!product) {
      return res.status(400).json({
        error: "Un producto en tu carrito ya no existe"
      });
    }

    // ❌ sin stock
    if (product.stock <= 0) {
      return res.status(400).json({
        error: `Sin stock: ${product.title}`
      });
    }

    // 🔻 descontar stock
    product.stock -= 1;

    total += Number(product.price);

    // 📈 sumar venta al vendedor
    const seller = users.find(
      u => u.id === product.seller
    );

    if (seller) {
      seller.totalSales += 1;
    }

  }

  // 🧹 limpiar carrito
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