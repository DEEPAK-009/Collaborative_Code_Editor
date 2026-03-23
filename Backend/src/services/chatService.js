const ChatMessage = require("../models/ChatMessage");

const saveMessage = async (roomId, userId,username, message) => {
  const chat = new ChatMessage({
    roomId,
    userId,
    username, 
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