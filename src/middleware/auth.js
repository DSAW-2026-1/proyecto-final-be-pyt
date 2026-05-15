const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "No autorizado (sin token)" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, "secret123");

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};

module.exports = auth;