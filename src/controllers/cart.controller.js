const users = require("../models/userMemory");
const products = require("../models/productMemory");

// =======================
// VER CARRITO
// =======================
const getCart = (req, res) => {

  const user = users.find(u => String(u.id) === String(req.user.id));

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  if (!user.cart) user.cart = [];

  res.json(user.cart);

};

// =======================
// AGREGAR PRODUCTO
// =======================
const addToCart = (req, res) => {

  const { productId } = req.body;

  const user = users.find(u => String(u.id) === String(req.user.id));

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  if (!user.cart) user.cart = [];

  const product = products.find(p => String(p.id) === String(productId));

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
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

  // 🔢 validar cantidad en carrito
  const count = user.cart.filter(
    p => String(p.id) === String(product.id)
  ).length;

  if (count >= product.stock) {
    return res.status(400).json({
      error: "No hay suficiente stock"
    });
  }

  // ✅ agregar copia segura (evita bugs por referencia)
  user.cart.push({ ...product });

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

  const user = users.find(u => String(u.id) === String(req.user.id));

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  if (!user.cart) user.cart = [];

  user.cart = user.cart.filter(
    p => String(p.id) !== String(id)
  );

  res.json({
    message: "Producto eliminado del carrito ✅",
    cart: user.cart
  });

};

// =======================
// CHECKOUT (VERSIÓN FINAL ESTABLE)
// =======================
const checkout = (req, res) => {

  const user = users.find(u => String(u.id) === String(req.user.id));

  if (!user) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  if (!user.cart || user.cart.length === 0) {
    return res.status(400).json({ error: "Carrito vacío" });
  }

  if (!user.purchases) user.purchases = [];

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

    // 🔥 guardar compra
    user.purchases.push({
      id: Date.now().toString(),

      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,

      sellerId: product.seller,

      date: new Date(),

      reviewed: false
    });

    // 📈 ventas del vendedor
    const seller = users.find(
      u => String(u.id) === String(product.seller)
    );

    if (seller) {
      seller.totalSales = (seller.totalSales || 0) + 1;
    }

  }

  // 🔥 limpiar carrito SIEMPRE
  user.cart = [];

  // 🔥 limpiar productos con stock 0 DESPUÉS del loop (evita bugs)
  const productsToRemove = products.filter(p => p.stock <= 0);

  productsToRemove.forEach(prod => {

    const index = products.findIndex(
      p => String(p.id) === String(prod.id)
    );

    if (index !== -1) {
      products.splice(index, 1);
    }

    // limpiar de todos los carritos
    users.forEach(u => {
      if (u.cart) {
        u.cart = u.cart.filter(
          item => String(item.id) !== String(prod.id)
        );
      }
    });

  });

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