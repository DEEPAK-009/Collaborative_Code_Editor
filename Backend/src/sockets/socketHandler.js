const roomService = require("../services/roomService");
const chatService = require("../services/chatService");

const rooms = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    const lastCursorUpdate = {};

    // JOIN ROOM
    socket.on("join-room", async ({ roomId, userId }) => {
      socket.join(roomId);

      const room = await roomService.joinRoom(roomId, userId);

      socket.emit("load-code", { code: room.code });

      const messages = await chatService.getRoomMessages(roomId);
      socket.emit("chat-history", messages);

      if (!rooms[roomId]) {
        rooms[roomId] = [];
      }

      const member = room.members.find((m) => m.userId.toString() === userId);

      if (!member) return;

      // prevent duplicate sockets
      const exists = rooms[roomId].some((u) => u.socketId === socket.id);

      if (!exists) {
        rooms[roomId].push({
          userId,
          socketId: socket.id,
          role: member.role,
        });
      }

      io.to(roomId).emit("users-update", rooms[roomId]);

      socket.to(roomId).emit("user-joined", {
        userId,
        socketId: socket.id,
      });
    });

    // CODE CHANGE
    socket.on("code-change", async ({ roomId, code }) => {
      await roomService.updateRoomCode(roomId, code);

      socket.to(roomId).emit("code-update", { code });

      socket.to(roomId).emit("cursor-reset");
    });

    // CHAT MESSAGE
    socket.on("send-message", async ({ roomId, userId, message }) => {
      const savedMessage = await chatService.saveMessage(
        roomId,
        userId,
        message,
      );

      io.to(roomId).emit("receive-message", savedMessage);
    });

    // LEAVE ROOM
    socket.on("leave-room", ({ roomId, userId }) => {
      socket.leave(roomId);

      if (!rooms[roomId]) return;

      rooms[roomId] = rooms[roomId].filter((u) => u.userId !== userId);

      io.to(roomId).emit("users-update", rooms[roomId]);

      socket.to(roomId).emit("user-left", userId);
    });

    // DISCONNECT
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);

      delete lastCursorUpdate[socket.id];

      for (const roomId in rooms) {
        const roomUsers = rooms[roomId];

        const leavingUser = roomUsers.find((u) => u.socketId === socket.id);

        if (!leavingUser) continue;

        rooms[roomId] = roomUsers.filter((u) => u.socketId !== socket.id);

        const remainingUsers = rooms[roomId];

        // CASE 1 → room empty
        if (remainingUsers.length === 0) {
          await roomService.deleteRoom(roomId);

          delete rooms[roomId];

          continue;
        }

        // CASE 2 → owner leaves
        const room = await roomService.getRoom(roomId);

        if (room && room.ownerId.toString() === leavingUser.userId) {
          const newOwner = await roomService.autoTransferOwnership(roomId);

          if (newOwner) {
            io.to(roomId).emit("ownership-transferred", newOwner);
          }
        }

        io.to(roomId).emit("users-update", remainingUsers);

        io.to(roomId).emit("user-left", leavingUser.userId);
      }
    });

    // CURSOR MOVE
    socket.on("cursor_move", ({ roomId, userId, username, position }) => {
      const now = Date.now();

      if (
        lastCursorUpdate[socket.id] &&
        now - lastCursorUpdate[socket.id] < 100
      ) {
        return;
      }

      lastCursorUpdate[socket.id] = now;

      if (!rooms[roomId]) return;

      const member = rooms[roomId].find((u) => u.userId === userId);

      if (!member || !["owner", "editor"].includes(member.role)) return;

      socket.to(roomId).emit("cursor_update", {
        userId,
        username,
        position,
      });
    });
  });
};

module.exports = socketHandler;
