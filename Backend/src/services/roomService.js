const { v4: uuidv4 } = require("uuid");
const Room = require("../models/Room");

const createRoom = async (ownerId) => {
  const roomId = uuidv4().slice(0, 6);
  const room = new Room({
    roomId,
    ownerId,
    members: [
      {
        userId: ownerId,
        role: "owner",
      },
    ],
    code: "",
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
    (member) => member.userId === userId,
  );
  if (!existingMember) {
    room.members.push({
      userId,
      role: "editor",
    });
    await room.save();
  }
  return room;
};

const updateRoomCode = async (roomId, code) => {
  const room = await Room.findOneAndUpdate({ roomId }, { code }, { new: true });
  return room;
};

const changeUserRole = async (roomId, targetUserId, newRole) => {
  const room = await Room.findOne({ roomId });

  if (!room) throw new Error("Room not found");

  const member = room.members.find((m) => m.userId === targetUserId);

  if (!member) throw new Error("User not in room");

  member.role = newRole;

  await room.save();

  return room;
};

const removeUser = async (roomId, userId) => {
  const room = await Room.findOne({ roomId });

  if (!room) throw new Error("Room not found");

  room.members = room.members.filter((member) => member.userId !== userId);

  await room.save();

  return room;
};

const transferOwnership = async (roomId, newOwnerId) => {
  const room = await Room.findOne({ roomId });

  if (!room) throw new Error("Room not found");

  room.ownerId = newOwnerId;

  room.members.forEach((member) => {
    if (member.userId === newOwnerId) {
      member.role = "owner";
    } else if (member.role === "owner") {
      member.role = "editor";
    }
  });

  await room.save();

  return room;
};

module.exports = {
  createRoom,
  joinRoom,
  updateRoomCode,
  changeUserRole,
  removeUser,
  transferOwnership,
};
