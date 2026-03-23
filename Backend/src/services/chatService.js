const ChatMessage = require("../models/ChatMessage");

const normalizeMessage = (chatMessage) => ({
  id: chatMessage._id.toString(),
  roomId: chatMessage.roomId,
  userId: chatMessage.userId,
  displayName: chatMessage.displayName || chatMessage.username || "Anonymous",
  message: chatMessage.message,
  createdAt: chatMessage.createdAt,
  updatedAt: chatMessage.updatedAt,
});

const saveMessage = async (roomId, userId, displayName, message) => {
  const chat = new ChatMessage({
    roomId,
    userId,
    displayName,
    message
  });
  await chat.save();
  return normalizeMessage(chat);
};

const getRoomMessages = async (roomId) => {
  const messages = await ChatMessage
    .find({ roomId })
    .sort({ createdAt: 1 })
    .limit(50);
  return messages.map(normalizeMessage);
};

module.exports = {
  normalizeMessage,
  saveMessage,
  getRoomMessages
};
