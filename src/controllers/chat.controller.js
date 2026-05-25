const chats = require("../models/chatMemory");

const sendMessage = (req, res) => {

  const { to, message } = req.body;

  chats.push({
    from: req.user.id,
    to,
    message,
    date: new Date()
  });

  res.json({ message: "Mensaje enviado" });
};

const getMessages = (req, res) => {

  const { userId } = req.params;

  const messages = chats.filter(
    m =>
      (m.from === req.user.id && m.to === userId) ||
      (m.from === userId && m.to === req.user.id)
  );

  res.json(messages);
};

module.exports = { sendMessage, getMessages };