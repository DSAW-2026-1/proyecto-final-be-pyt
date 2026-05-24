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

  // ❌ producto no existe
  if (!product) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  // ❌ no comprar su propio producto
  if (String(product.seller) === String(req.user.id)) {
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

  // 🔢 cantidad en carrito
  const countInCart = user.cart.filter(
    p => String(p.id) === String(product.id)
  ).length;

  // ❌ excede stock
  if (countInCart >= product.stock) {
    return res.status(400).json({
      error: "No hay suficiente stock"
    });
  }

  // ✅ agregar
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
      error: "El carrito está vacío"
    });
  }

  let total = 0;

  for (let item of user.cart) {

    const product = products.find(
      p => String(p.id) === String(item.id)
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
      u => String(u.id) === String(product.seller)
    );

    if (seller) {
      seller.totalSales += 1;
    }

    // 🔥 eliminar producto si stock llega a 0
    if (product.stock <= 0) {

      const index = products.findIndex(
        p => String(p.id) === String(product.id)
      );

      if (index !== -1) {
        products.splice(index, 1);
      }

      // 🔥 eliminar de TODOS los carritos
      users.forEach(u => {
        u.cart = u.cart.filter(
          p => String(p.id) !== String(product.id)
        );
      });

    }

  }

  // 🧹 limpiar carrito del usuario
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