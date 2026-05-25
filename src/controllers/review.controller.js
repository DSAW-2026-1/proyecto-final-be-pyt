const users = require("../models/userMemory");
const products = require("../models/productMemory");

const addReview = (req, res) => {

  const { productId, rating, comment } = req.body;

  const user = users.find(
    u => String(u.id) === String(req.user.id)
  );

  if (!user) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  // 🔥 BUSCAR COMPRA
  const purchase = user.purchases.find(
    p => String(p.productId) === String(productId)
  );

  if (!purchase) {
    return res.status(403).json({
      error: "No puedes calificar un producto que no compraste"
    });
  }

  // ❌ ya calificado
  if (purchase.reviewed) {
    return res.status(400).json({
      error: "Ya calificaste este producto"
    });
  }

  // 🔍 buscar producto
  const product = products.find(
    p => String(p.id) === String(productId)
  );

  if (!product) {
    return res.status(404).json({
      error: "Producto no encontrado"
    });
  }

  // 🔍 vendedor
  const seller = users.find(
    u => String(u.id) === String(product.seller)
  );

  if (!seller) {
    return res.status(404).json({
      error: "Vendedor no encontrado"
    });
  }

  // ⭐ guardar review
  seller.reviews.push({
    userId: user.id,
    rating: Number(rating),
    comment
  });

  // 🔥 marcar compra como calificada
  purchase.reviewed = true;

  // ⭐ calcular promedio
  const total = seller.reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = total / seller.reviews.length;

  seller.rating = avg.toFixed(1);

  res.json({
    message: "Reseña agregada ✅"
  });

};

module.exports = {
  addReview
};