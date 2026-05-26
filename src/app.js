require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// ===============================
// MIDDLEWARES
// ===============================
app.use(cors({
  origin: "https://proyecto-final-fe-pyt.vercel.app"
}));

app.use(express.json());

// ===============================
// RUTA TEST
// ===============================
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// ===============================
// IMPORTAR RUTAS
// ===============================
const authRoutes = require("./routes/auth.routes");

const userRoutes = require("./routes/user.routes");

const adminRoutes = require("./routes/admin.routes");

const productRoutes = require("./routes/product.routes");

const profileRoutes = require("./routes/profile.routes");

const cartRoutes = require("./routes/cart.routes");

const reviewRoutes = require("./routes/review.routes");

const reportRoutes = require("./routes/report.routes");

const chatRoutes = require("./routes/chat.routes");

// ===============================
// USAR RUTAS
// ===============================

// auth
app.use("/api/auth", authRoutes);

// users
app.use("/api/user", userRoutes);

// admin
app.use("/api/admin", adminRoutes);

// products
app.use("/api/products", productRoutes);

// profile
app.use("/api/profile", profileRoutes);

// cart
app.use("/api/cart", cartRoutes);

// reviews
app.use("/api/reviews", reviewRoutes);

// reports
app.use("/api/reports", reportRoutes);

// chat
app.use("/api/chat", chatRoutes);

// ===============================
// 404
// ===============================
app.use((req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada"
  });
});

// ===============================
// SERVER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});


