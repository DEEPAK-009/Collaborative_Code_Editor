const roomService = require("../services/roomService");

const createRoom = async (req, res) => {
  try {
    const { ownerId } = req.body;

    const room = await roomService.createRoom(ownerId);

    res.status(201).json({
      roomId: room.roomId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const joinRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    // const { userId } = req.body;
    const userId = req.user.id;

    const room = await roomService.joinRoom(roomId, userId);

    res.status(200).json(room);
  } catch (error) {
    if (error.message === "Room not found") {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

const changeRole = async (req, res) => {
  try {
    const { roomId, userId, role } = req.body;

    const room = await roomService.changeUserRole(roomId, userId, role);

    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeUserFromRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    const room = await roomService.removeUser(roomId, userId);

    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const transferOwnershipController = async (req, res) => {
  try {
    const { roomId, newOwnerId } = req.body;

    const room = await roomService.transferOwnership(roomId, newOwnerId);

    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
module.exports = {
  createRoom,
  joinRoom,
  changeRole,
  removeUserFromRoom,
  transferOwnershipController,
};
