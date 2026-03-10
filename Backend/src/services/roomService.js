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

const joinRoom = async (roomId, userId) => {

  const room = await Room.findOne({ roomId });

  if (!room) {
    throw new Error("Room not found");
  }

  const existingMember = room.members.find(
    (member) => member.userId === userId
  );

  if (!existingMember) {
    room.members.push({
      userId,
      role: "editor"
    });

    await room.save();
  }

  return room;
};
module.exports = {
  createRoom,
  joinRoom
};