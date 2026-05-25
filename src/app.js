require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// ===============================
// 🔥 MIDDLEWARES
// ===============================
app.use(cors({
  origin: "https://proyecto-final-fe-pyt.vercel.app"
}));

app.use(express.json());

// ===============================
// 🔥 RUTA DE PRUEBA
// ===============================
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// ===============================
// 🔥 IMPORTAR RUTAS
// ===============================
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const productRoutes = require("./routes/product.routes");
const profileRoutes = require("./routes/profile.routes");
const cartRoutes = require("./routes/cart.routes");
const reviewRoutes = require("./routes/review.routes");

// 🆕 NUEVAS
const reportRoutes = require("./routes/report.routes");
const chatRoutes = require("./routes/chat.routes");

// ===============================
// 🔥 USAR RUTAS (ORDEN IMPORTA)
// ===============================

// auth primero (login/register)
app.use("/api/auth", authRoutes);

// usuario
app.use("/api/user", userRoutes);

// perfil
app.use("/api/profile", profileRoutes);

// productos
app.use("/api/products", productRoutes);

// carrito
app.use("/api/cart", cartRoutes);

// reseñas
app.use("/api/reviews", reviewRoutes);

// 🆕 reportes
app.use("/api/reports", reportRoutes);

// 🆕 chat
app.use("/api/chat", chatRoutes);

// admin
app.use("/api/admin", adminRoutes);

// ===============================
// 🔥 MANEJO DE ERRORES 404
// ===============================
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

// ===============================
// 🔥 SERVIDOR
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});