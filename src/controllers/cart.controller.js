const users = require("../models/userMemory");
const products = require("../models/productMemory");

// =======================
// VER CARRITO
// =======================
const getCart = (req, res) => {
  try {
    const user = users.find(u => String(u.id) === String(req.user.id));

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!user.cart) user.cart = [];

    res.json(user.cart);

  } catch (error) {
    console.error("ERROR getCart:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

// =======================
// AGREGAR PRODUCTO
// =======================
const addToCart = (req, res) => {
  try {
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

    // ❌ no comprar propio producto
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
    const count = user.cart.filter(
      p => String(p.id) === String(product.id)
    ).length;

    if (count >= product.stock) {
      return res.status(400).json({
        error: "No hay suficiente stock"
      });
    }

    // ✅ copiar producto (IMPORTANTE)
    user.cart.push({ ...product });

    res.json({
      message: "Producto agregado al carrito ✅",
      cart: user.cart
    });

  } catch (error) {
    console.error("ERROR addToCart:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

// =======================
// ELIMINAR DEL CARRITO
// =======================
const removeFromCart = (req, res) => {
  try {
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

  } catch (error) {
    console.error("ERROR removeFromCart:", error);
    res.status(500).json({ error: "Error interno" });
  }
};

// =======================
// CHECKOUT (VERSIÓN FINAL REAL)
// =======================
const checkout = (req, res) => {
  try {
    const user = users.find(u => String(u.id) === String(req.user.id));

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ error: "Carrito vacío" });
    }

    if (!user.purchases) user.purchases = [];

    let total = 0;

    // 🔥 VALIDAR TODO ANTES DE COMPRAR
    for (let item of user.cart) {
      const product = products.find(
        p => String(p.id) === String(item.id)
      );

      if (!product) {
        return res.status(400).json({
          error: `Producto eliminado: ${item.title}`
        });
      }

      if (product.stock <= 0) {
        return res.status(400).json({
          error: `Sin stock: ${product.title}`
        });
      }

      if (String(product.seller) === String(req.user.id)) {
        return res.status(403).json({
          error: "No puedes comprar tu propio producto"
        });
      }
    }

    // 🔥 PROCESAR COMPRA
    for (let item of user.cart) {

      const product = products.find(
        p => String(p.id) === String(item.id)
      );

      // descontar stock
      product.stock -= 1;

      total += Number(product.price);

      // guardar compra
      user.purchases.push({
        id: Date.now().toString() + Math.random(),

        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,

        sellerId: product.seller,

        date: new Date(),

        reviewed: false
      });

      // sumar ventas al vendedor
      const seller = users.find(
        u => String(u.id) === String(product.seller)
      );

      if (seller) {
        seller.totalSales = (seller.totalSales || 0) + 1;
      }
    }

    // 🔥 LIMPIAR CARRITO
    user.cart = [];

    // 🔥 ELIMINAR PRODUCTOS SIN STOCK
    for (let i = products.length - 1; i >= 0; i--) {
      if (products[i].stock <= 0) {

        const removedId = products[i].id;

        products.splice(i, 1);

        // limpiar de TODOS los carritos
        users.forEach(u => {
          if (u.cart) {
            u.cart = u.cart.filter(
              item => String(item.id) !== String(removedId)
            );
          }
        });
      }
    }

    res.json({
      message: "Compra realizada ✅",
      total
    });

  } catch (error) {
    console.error("ERROR checkout:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  checkout
};