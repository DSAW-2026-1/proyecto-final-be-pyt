const users = require("../models/userMemory");
const products = require("../models/productMemory");

const addReview = (req, res) => {

  const { productId, rating, comment } = req.body;

  const buyer = users.find(u => u.id == req.user.id);

  if (!buyer) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const product = products.find(p => p.id == productId);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const seller = users.find(u => u.id == product.seller);

  // ❌ NO HA COMPRADO
  const hasPurchased = buyer.purchases.some(
    p => p.productId == productId
  );

  if (!hasPurchased) {
    return res.status(403).json({
      error: "Debes comprar el producto para calificar"
    });
  }

  // ❌ YA RESEÑÓ
  const alreadyReviewed = seller.reviews.some(
    r => r.userId == buyer.id && r.productId == productId
  );

  if (alreadyReviewed) {
    return res.status(400).json({
      error: "Ya calificaste este producto"
    });
  }

  // ✅ CREAR RESEÑA
  const newReview = {
    id: Date.now().toString(),
    rating: Number(rating),
    comment: comment || "",
    user: buyer.name,

    // 🔥 CLAVE
    userId: buyer.id,
    productId
  };

  seller.reviews.push(newReview);

  // ⭐ recalcular rating
  const total = seller.reviews.reduce((acc, r) => acc + r.rating, 0);
  seller.rating = (total / seller.reviews.length).toFixed(1);

  res.json({
    message: "Reseña agregada",
    rating: seller.rating
  });

};

module.exports = { addReview };