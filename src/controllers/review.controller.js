const users = require("../models/userMemory");
const products = require("../models/productMemory");

// ==========================
// CREAR RESEÑA
// ==========================
const addReview = (req, res) => {

  const { productId, rating, comment } = req.body;

  const buyer = users.find(
    u => String(u.id) === String(req.user.id)
  );

  if (!buyer) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const product = products.find(
    p => String(p.id) === String(productId)
  );

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const seller = users.find(
    u => String(u.id) === String(product.seller)
  );

  if (!seller) {
    return res.status(404).json({ error: "Vendedor no encontrado" });
  }

  // ❌ evitar auto-review
  if (String(seller.id) === String(buyer.id)) {
    return res.status(403).json({
      error: "No puedes calificarte a ti mismo"
    });
  }

  // 🔥 crear reseña
  const newReview = {
    id: Date.now().toString(),
    rating: Number(rating),
    comment: comment || "",
    user: buyer.name
  };

  seller.reviews.push(newReview);

  // ⭐ recalcular rating
  const total = seller.reviews.reduce((acc, r) => acc + r.rating, 0);

  seller.rating = (total / seller.reviews.length).toFixed(1);

  res.json({
    message: "Reseña agregada",
    reviews: seller.reviews,
    rating: seller.rating
  });

};

module.exports = {
  addReview
};