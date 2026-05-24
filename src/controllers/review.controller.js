const users = require("../models/userMemory");
const products = require("../models/productMemory");

const addReview = (req, res) => {

  const { productId, rating, comment } = req.body;

  // 🔍 validar usuario
  const buyer = users.find(u => String(u.id) === String(req.user.id));

  if (!buyer) {
    return res.status(404).json({
      error: "Usuario no encontrado"
    });
  }

  // 🔍 validar rating
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      error: "La calificación debe ser entre 1 y 5"
    });
  }

  // 🔍 buscar compra (CLAVE)
  const purchase = buyer.purchases?.find(
    p => String(p.productId) === String(productId)
  );

  if (!purchase) {
    return res.status(403).json({
      error: "Debes comprar este producto para calificar"
    });
  }

  // ❌ ya reseñado
  if (purchase.reviewed) {
    return res.status(400).json({
      error: "Ya calificaste este producto"
    });
  }

  // 🔍 buscar producto (opcional)
  const product = products.find(
    p => String(p.id) === String(productId)
  );

  // 🔍 obtener sellerId (IMPORTANTE)
  const sellerId = product
    ? product.seller
    : purchase.sellerId;

  const seller = users.find(
    u => String(u.id) === String(sellerId)
  );

  if (!seller) {
    return res.status(404).json({
      error: "Vendedor no encontrado"
    });
  }

  // ❌ evitar auto-review
  if (String(seller.id) === String(buyer.id)) {
    return res.status(403).json({
      error: "No puedes calificarte a ti mismo"
    });
  }

  // 🔍 evitar doble review (extra seguridad)
  const alreadyReviewed = seller.reviews.some(
    r =>
      String(r.userId) === String(buyer.id) &&
      String(r.productId) === String(productId)
  );

  if (alreadyReviewed) {
    return res.status(400).json({
      error: "Ya calificaste este producto"
    });
  }

  // ✅ crear reseña
  const newReview = {
    id: Date.now().toString(),
    rating: Number(rating),
    comment: comment || "",
    user: buyer.name,

    userId: buyer.id,
    productId
  };

  seller.reviews.push(newReview);

  // ⭐ recalcular rating
  const total = seller.reviews.reduce(
    (acc, r) => acc + r.rating,
    0
  );

  seller.rating = (total / seller.reviews.length).toFixed(1);

  // 🔥 marcar compra como reseñada
  purchase.reviewed = true;

  res.json({
    message: "Reseña agregada correctamente ⭐",
    rating: seller.rating,
    reviews: seller.reviews
  });

};

module.exports = {
  addReview
};