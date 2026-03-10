const roomService = require("../services/roomService");

const createRoom = async (req, res) => {
  try {

    const { ownerId } = req.body;

    const room = await roomService.createRoom(ownerId);

    res.status(201).json({
      roomId: room.roomId
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createRoom
};