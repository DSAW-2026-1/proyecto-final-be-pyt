const users = require("../models/userMemory");
const products = require("../models/productMemory");

// =======================
// VER CARRITO
// =======================
const getCart = (req, res) => {

  const user = users.find(
    u => String(u.id) === String(req.user.id)
  );

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  res.json(user.cart);

};

// =======================
// AGREGAR PRODUCTO
// =======================
const addToCart = (req, res) => {

  const { productId } = req.body;

  const user = users.find(
    u => String(u.id) === String(req.user.id)
  );

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  const product = products.find(
    p => String(p.id) === String(productId)
  );

  if (!product) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  // ❌ no comprar propio producto
  if (String(product.seller) === String(req.user.id)) {
    return res.status(403).json({
      error: "No puedes comprar tu propio producto"
    });
  }

  // ❌ sin stock
  if (product.stock <= 0) {
    return res.status(400).json({
      error: "Sin stock"
    });
  }

  // ❌ controlar cantidad
  const count = user.cart.filter(
    p => String(p.id) === String(product.id)
  ).length;

  if (count >= product.stock) {
    return res.status(400).json({
      error: "Stock insuficiente"
    });
  }

  user.cart.push(product);

  res.json({
    message: "Producto agregado al carrito ✅",
    cart: user.cart
  });

};

// =======================
// ELIMINAR DEL CARRITO
// =======================
const removeFromCart = (req, res) => {

  const { id } = req.params;

  const user = users.find(
    u => String(u.id) === String(req.user.id)
  );

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  user.cart = user.cart.filter(
    p => String(p.id) !== String(id)
  );

  res.json({
    message: "Producto eliminado del carrito ✅",
    cart: user.cart
  });

};

// =======================
// CHECKOUT
// =======================
const checkout = (req, res) => {

  const user = users.find(
    u => String(u.id) === String(req.user.id)
  );

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  if (user.cart.length === 0) {
    return res.status(400).json({
      error: "Carrito vacío"
    });
  }

  let total = 0;

  for (let item of user.cart) {

    const product = products.find(
      p => String(p.id) === String(item.id)
    );

    if (!product) {
      return res.status(400).json({
        error: "Un producto ya no existe"
      });
    }

    if (product.stock <= 0) {
      return res.status(400).json({
        error: `Sin stock: ${product.title}`
      });
    }

    product.stock -= 1;

    total += Number(product.price);

    // sumar ventas
    const seller = users.find(
      u => String(u.id) === String(product.seller)
    );

    if (seller) {
      seller.totalSales += 1;
    }

    // eliminar si stock = 0
    if (product.stock <= 0) {

      const index = products.findIndex(
        p => String(p.id) === String(product.id)
      );

      if (index !== -1) {
        products.splice(index, 1);
      }

      // limpiar carritos
      users.forEach(u => {
        u.cart = u.cart.filter(
          p => String(p.id) !== String(product.id)
        );
      });

    }

  }

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