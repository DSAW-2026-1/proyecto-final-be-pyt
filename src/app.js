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

// ===============================
// 🔥 USAR RUTAS (ORDENADO)
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use("/api/profile", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

// ===============================
// 🔥 MANEJO DE ERRORES 404 (CLAVE)
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