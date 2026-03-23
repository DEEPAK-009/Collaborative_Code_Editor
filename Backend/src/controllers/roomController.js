const roomService = require("../services/roomService");
const presenceStore = require("../sockets/presenceStore");

const emitRoomState = (req, room) => {
  const io = req.app.get("io");
  const activeUsers = presenceStore.getActiveUsers(room.roomId);
  const serializedRoom = roomService.serializeRoom(room, activeUsers);

  io.to(room.roomId).emit("presence-updated", activeUsers);
  io.to(room.roomId).emit("room-updated", serializedRoom);

  return serializedRoom;
};

const createRoom = async (req, res) => {
  try {
    const room = await roomService.createRoom(req.user.id);

    res.status(201).json({
      room: roomService.serializeRoom(room),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const room = await roomService.joinRoom(roomId, req.user.id);
    const activeUsers = presenceStore.getActiveUsers(roomId);

    res.status(200).json({
      room: roomService.serializeRoom(room, activeUsers),
    });
  } catch (error) {
    if (error.message === "Room not found") {
      return res.status(404).json({ error: "Room not found" });
    }

    res.status(400).json({ error: error.message });
  }
};

const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { room } = await roomService.assertRoomMember(roomId, req.user.id);
    const activeUsers = presenceStore.getActiveUsers(roomId);

    res.json({
      room: roomService.serializeRoom(room, activeUsers),
    });
  } catch (error) {
    const statusCode = error.message === "Room not found" ? 404 : 403;
    res.status(statusCode).json({ error: error.message });
  }
};

const changeRole = async (req, res) => {
  try {
    const { roomId, userId } = req.params;
    const { role } = req.body;

    const room = await roomService.changeUserRole({
      roomId,
      actorId: req.user.id,
      targetUserId: userId,
      newRole: role,
    });

    presenceStore.setUserRole(roomId, userId, role);

    res.json({
      room: emitRoomState(req, room),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeUserFromRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.params;

    const room = await roomService.removeUser({
      roomId,
      actorId: req.user.id,
      targetUserId: userId,
    });

    const io = req.app.get("io");
    const socketIds = presenceStore.removeUser(roomId, userId);

    for (const socketId of socketIds) {
      const socket = io.sockets.sockets.get(socketId);

      if (socket) {
        socket.leave(roomId);
        socket.emit("removed-from-room", { roomId });
      }
    }

    res.json({
      room: emitRoomState(req, room),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const transferOwnershipController = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { newOwnerId } = req.body;

    const room = await roomService.transferOwnership({
      roomId,
      actorId: req.user.id,
      newOwnerId,
    });

    presenceStore.setUserRole(roomId, req.user.id, "editor");
    presenceStore.setUserRole(roomId, newOwnerId, "owner");

    const serializedRoom = emitRoomState(req, room);
    req.app.get("io").to(roomId).emit("ownership-transferred", {
      userId: newOwnerId,
    });

    res.json({ room: serializedRoom });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  createRoom,
  getRoom,
  joinRoom,
  changeRole,
  removeUserFromRoom,
  transferOwnershipController,
};
