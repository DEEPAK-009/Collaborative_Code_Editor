const roomService = require("../services/roomService");
const rooms = {};
const chatService = require("../services/chatService");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", async ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`${userId} joined room ${roomId}`);
      const room = await roomService.joinRoom(roomId, userId);
      // send existing code to the user
      socket.emit("load-code", {
        code: room.code,
      });

      const messages = await chatService.getRoomMessages(roomId);
      socket.emit("chat-history", messages);

      // track user in memory
      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }
      rooms[roomId].push({
        userId,
        socketId: socket.id,
      });

      // send updated users list
      io.to(roomId).emit("users-update", rooms[roomId]);

      // notify others
      socket.to(roomId).emit("user-joined", {
        userId,
        socketId: socket.id,
      });
    });

    socket.on("code-change", async ({ roomId, code }) => {
      await roomService.updateRoomCode(roomId, code);
      socket.to(roomId).emit("code-update", { code });
    });

    socket.on("send-message", async ({ roomId, userId, message }) => {
      const savedMessage = await chatService.saveMessage(
        roomId,
        userId,
        message,
      );
      io.to(roomId).emit("receive-message", savedMessage);
    });

    socket.on("leave-room", ({ roomId, userId }) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user-left", { userId });
    });

    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);

      for (const roomId in rooms) {
        const roomUsers = rooms[roomId];

        const leavingUser = roomUsers.find((u) => u.socketId === socket.id);

        if (!leavingUser) continue;

        // remove user
        rooms[roomId] = roomUsers.filter((u) => u.socketId !== socket.id);

        const remainingUsers = rooms[roomId];

        // CASE 1 → room empty
        if (remainingUsers.length === 0) {
          await roomService.deleteRoom(roomId);

          delete rooms[roomId];

          continue;
        }

        // CASE 2 → owner leaves
        const room = await Room.findOne({ roomId });

        if (room && room.ownerId === leavingUser.userId) {
          const newOwner = await roomService.autoTransferOwnership(roomId);

          if (newOwner) {
            io.to(roomId).emit("ownership-transferred", newOwner);
          }
        }

        io.to(roomId).emit("users-update", remainingUsers);
      }
    });
  });
};

module.exports = socketHandler;
