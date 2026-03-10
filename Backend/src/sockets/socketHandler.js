const roomService = require("../services/roomService");

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);
    socket.on("join-room", ({ roomId, userId }) => {
      socket.join(roomId);
      console.log(`${userId} joined room ${roomId}`);
      // send existing code to the user who joined
      socket.emit("load-code", {
        code: room.code
      });
      socket.to(roomId).emit("user-joined", {
        userId,
        socketId: socket.id
      });
    });

    socket.on("code-change", async ({ roomId, code }) => {
        await roomService.updateRoomCode(roomId, code);
        socket.to(roomId).emit("code-update", { code });
    });

    socket.on("leave-room", ({ roomId, userId }) => {
        socket.leave(roomId);
        socket.to(roomId).emit("user-left", { userId });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

  });

};

module.exports = socketHandler;