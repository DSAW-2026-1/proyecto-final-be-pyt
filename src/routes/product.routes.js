const express = require("express");

const auth = require("../middleware/auth");

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");

const router = express.Router();

// crear producto
router.post("/", auth, createProduct);

// obtener productos
router.get("/", getProducts);

// editar producto
router.put("/:id", auth, updateProduct);

// eliminar producto
router.delete("/:id", auth, deleteProduct);

module.exports = router;