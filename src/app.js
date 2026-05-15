const express = require("express");
const cors = require("cors");

// rutas
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const adminRoutes = require("./routes/admin.routes");
const productRoutes = require("./routes/product.routes");
const profileRoutes = require("./routes/profile.routes");
const cartRoutes = require("./routes/cart.routes");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/cart", cartRoutes);
// ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// rutas
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// levantar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});