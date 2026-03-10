const { v4: uuidv4 } = require("uuid");
const Room = require("../models/Room");

const createRoom = async (ownerId) => {

  const roomId = uuidv4().slice(0,6);

  const room = new Room({
    roomId,
    ownerId,
    members: [
      {
        userId: ownerId,
        role: "owner"
      }
    ],
    code: ""
  });

  await room.save();

  return room;
};

module.exports = {
  createRoom
};