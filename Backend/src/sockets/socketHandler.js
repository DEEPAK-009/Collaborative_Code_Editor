const roomService = require("../services/roomService");
const rooms = {};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", async ({ roomId, userId }) => {
        socket.join(roomId);
        console.log(`${userId} joined room ${roomId}`);
        const room = await roomService.joinRoom(roomId, userId);
        // send existing code to the user
        socket.emit("load-code", {
            code: room.code
        });
        // track user in memory
        if (!rooms[roomId]) {
            rooms[roomId] = [];
        }
        rooms[roomId].push({
            userId,
            socketId: socket.id
        });
        // send updated users list
        io.to(roomId).emit("users-update", rooms[roomId]);
        // notify others
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
      for (const roomId in rooms) {
        rooms[roomId] = rooms[roomId].filter(
        user => user.socketId !== socket.id
        );
        io.to(roomId).emit("users-update", rooms[roomId]);
    }
    });

  });

};

module.exports = socketHandler;