const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  try {

    const authHeader = req.headers.authorization;

    // 🔴 SI NO HAY TOKEN
    if (!authHeader) {
      return res.status(401).json({
        error: "No token provided"
      });
    }

    // 🔥 SEPARAR "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        error: "Invalid token format"
      });
    }

    // 🔐 VERIFICAR TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    );

    req.user = decoded;

    next();

  } catch (error) {

    console.error("AUTH ERROR:", error);

    return res.status(401).json({
      error: "Token inválido"
    });

  }

};