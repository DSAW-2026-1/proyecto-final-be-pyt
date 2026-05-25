const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const { sendMessage, getMessages } = require("../controllers/chat.controller");

router.post("/", auth, sendMessage);
router.get("/:userId", auth, getMessages);

module.exports = router;