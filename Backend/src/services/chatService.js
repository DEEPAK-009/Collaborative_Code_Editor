const ChatMessage = require("../models/ChatMessage");

const saveMessage = async (roomId, userId, message) => {
  const chat = new ChatMessage({
    roomId,
    userId,
    message
  });
  await chat.save();
  return chat;
};

const getRoomMessages = async (roomId) => {
  const messages = await ChatMessage
    .find({ roomId })
    .sort({ createdAt: 1 })
    .limit(50);
  return messages;
};

module.exports = {
  saveMessage,
  getRoomMessages
};