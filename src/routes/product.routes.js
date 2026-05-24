const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");

const auth = require("../middleware/auth");

// ✅ rutas correctas
router.get("/", getProducts);
router.post("/", auth, createProduct);

// 🔥 ESTO ARREGLA TU 404
router.put("/:id", auth, updateProduct);
router.delete("/:id", auth, deleteProduct);

module.exports = router;