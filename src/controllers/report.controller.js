const reports = require("../models/reportMemory");

const createReport = (req, res) => {

  const { productId, reason } = req.body;

  reports.push({
    id: Date.now().toString(),
    productId,
    reason,
    user: req.user.id
  });

  res.json({ message: "Reporte enviado ✅" });
};

module.exports = { createReport };