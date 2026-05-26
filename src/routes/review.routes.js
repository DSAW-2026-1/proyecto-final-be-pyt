const express = require("express");
const router = express.Router();

const { addReview } = require("../controllers/review.controller");

const auth = require("../middleware/auth");

router.post("/", auth, addReview);

module.exports = router;