const roomService = require("../services/roomService");
const chatService = require("../services/chatService");
const presenceStore = require("./presenceStore");

const DISCONNECT_GRACE_MS = 15000;
const CURSOR_THROTTLE_MS = 100;

const emitRoomSnapshot = async (io, roomId) => {
  const room = await roomService.getRoom(roomId);

  if (!room) {
    return;
  }

  const activeUsers = presenceStore.getActiveUsers(roomId);
  io.to(roomId).emit("presence-updated", activeUsers);
  io.to(roomId).emit("room-updated", roomService.serializeRoom(room, activeUsers));
};

const finalizeDeparture = async (io, roomId, userId) => {
  if (presenceStore.hasActiveUserInRoom(roomId, userId)) {
    return;
  }

  try {
    const result = await roomService.leaveRoom(roomId, userId);

    if (result.deleted) {
      io.to(roomId).emit("room-closed", { roomId });
      presenceStore.clearRoom(roomId);
      return;
    }

    if (result.ownershipTransferredTo) {
      presenceStore.setUserRole(
        roomId,
        result.ownershipTransferredTo.userId,
        "owner"
      );
      io.to(roomId).emit("ownership-transferred", result.ownershipTransferredTo);
    }

    await emitRoomSnapshot(io, roomId);
    io.to(roomId).emit("user-left", { roomId, userId });
  } catch (error) {
    if (error.message !== "Room not found") {
      console.error("Failed to finalize room departure", error);
    }
  }
};

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    const lastCursorUpdate = {};

    const handleJoinRoom = async (payload = {}, rejoined = false) => {
      const { roomId } = payload;

      if (!roomId) {
        socket.emit("room-error", { message: "Room ID is required" });
        return;
      }

      try {
        const room = await roomService.joinRoom(roomId, socket.user.id);
        const member = room.members.find(
          (activeMember) => activeMember.userId === socket.user.id
        );

        socket.join(roomId);
        socket.data.roomId = roomId;
        socket.data.userId = socket.user.id;

        presenceStore.clearDisconnectCleanup(roomId, socket.user.id);
        presenceStore.addSocketToRoom({
          roomId,
          userId: socket.user.id,
          socketId: socket.id,
          displayName: member.displayName,
          role: member.role,
        });

        const messages = await chatService.getRoomMessages(roomId);
        const activeUsers = presenceStore.getActiveUsers(roomId);

        socket.emit("room-state", {
          room: roomService.serializeRoom(room, activeUsers),
          messages,
          rejoined,
        });

        io.to(roomId).emit("presence-updated", activeUsers);
        io.to(roomId).emit("room-updated", roomService.serializeRoom(room, activeUsers));
      } catch (error) {
        const message =
          error.message === "Room not found"
            ? "Room not found"
            : "Unable to join room";

        socket.emit("room-error", { message });
      }
    };

    socket.on("join-room", async (payload) => {
      await handleJoinRoom(payload, false);
    });

    socket.on("rejoin-room", async (payload) => {
      await handleJoinRoom(payload, true);
    });

    socket.on("code-change", async ({ roomId, code, language }) => {
      const userId = socket.user.id;

      if (!roomId || typeof code !== "string") {
        return;
      }

      const activeUser = presenceStore.getActiveUser(roomId, userId);

      if (!activeUser || !["owner", "editor"].includes(activeUser.role)) {
        return;
      }

      const room = await roomService.updateRoomCode(roomId, code, language);

      io.to(roomId).emit("code-update", {
        code,
        language: room?.language || language,
        updatedBy: userId,
      });
      await emitRoomSnapshot(io, roomId);
    });

    socket.on("send-message", async ({ roomId, message }) => {
      const userId = socket.user.id;
      const activeUser = presenceStore.getActiveUser(roomId, userId);

      if (!activeUser || !message?.trim()) {
        return;
      }

      const savedMessage = await chatService.saveMessage(
        roomId,
        userId,
        activeUser.displayName,
        message.trim()
      );

      io.to(roomId).emit("receive-message", savedMessage);
    });

    socket.on("leave-room", async ({ roomId }) => {
      const userId = socket.user.id;

      presenceStore.clearDisconnectCleanup(roomId, userId);
      socket.leave(roomId);
      const removal = presenceStore.removeSocket(socket.id);

      if (!removal) {
        return;
      }

      io.to(roomId).emit("cursor-remove", { userId });

      if (!removal.hasRemainingUserSockets) {
        await finalizeDeparture(io, roomId, userId);
      } else {
        await emitRoomSnapshot(io, roomId);
      }
    });

    socket.on("disconnect", async () => {
      delete lastCursorUpdate[socket.id];

      const removal = presenceStore.removeSocket(socket.id);

      if (!removal) {
        return;
      }

      io.to(removal.roomId).emit("cursor-remove", { userId: removal.userId });
      await emitRoomSnapshot(io, removal.roomId);

      if (!removal.hasRemainingUserSockets) {
        presenceStore.scheduleDisconnectCleanup(
          removal.roomId,
          removal.userId,
          async () => {
            await finalizeDeparture(io, removal.roomId, removal.userId);
          },
          DISCONNECT_GRACE_MS
        );
      }
    });

    socket.on("cursor_move", ({ roomId, position }) => {
      const userId = socket.user.id;
      const now = Date.now();
      const activeUser = presenceStore.getActiveUser(roomId, userId);

      if (!activeUser || !["owner", "editor"].includes(activeUser.role)) {
        return;
      }

      if (
        lastCursorUpdate[socket.id] &&
        now - lastCursorUpdate[socket.id] < CURSOR_THROTTLE_MS
      ) {
        return;
      }

      lastCursorUpdate[socket.id] = now;

      if (
        !position ||
        typeof position.lineNumber !== "number" ||
        typeof position.column !== "number"
      ) {
        return;
      }

      socket.to(roomId).emit("cursor_update", {
        userId,
        displayName: activeUser.displayName,
        position,
      });
    });
  });
};

module.exports = socketHandler;
