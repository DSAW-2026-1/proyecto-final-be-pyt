const express = require("express");

const auth = require("../middleware/auth");

const {
  getCart,
  addToCart,
  removeFromCart,
  checkout
} = require("../controllers/cart.controller");

const router = express.Router();

// ver carrito
router.get("/", auth, getCart);

// agregar producto
router.post("/add", auth, addToCart);

// eliminar producto
router.delete("/:id", auth, removeFromCart);

// comprar
router.post("/checkout", auth, checkout);

module.exports = router;