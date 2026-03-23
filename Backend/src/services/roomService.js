const { v4: uuidv4 } = require("uuid");
const Room = require("../models/Room");
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");

const createRoom = async (ownerId, username) => {
  const roomId = uuidv4().slice(0, 6);
  const user = await User.findById(ownerId);
  const room = new Room({
    roomId,
    ownerId,
    members: [
      {
        userId: ownerId,
        username: user.username ,
        role: "owner",
      },
    ],
    code: "",
  });
  await room.save();
  return room;
};

const joinRoom = async (roomId, userId) => {
  const user = await User.findById(userId);
  if (!user) return null;
  const room = await Room.findOne({ roomId });

  if (!room) {
    console.log("Room not found");
    return null;
  }

  console.log("Room before update:", room.members);

  const existingMember = room.members.find(
    (m) => m.userId.toString() === userId.toString()
  );

  if (!existingMember) {
  room.members.push({
    userId,
    username: user.username,
    role: "editor",
  });
} else {
  // ✅ UPDATE username if changed
  existingMember.username = user.username;
}
  await room.save();
  return room ;
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

const deleteRoom = async (roomId) => {
  await Room.deleteOne({ roomId });
  await ChatMessage.deleteMany({ roomId });
};

const autoTransferOwnership = async (roomId) => {
  const room = await Room.findOne({ roomId });

  if (!room) return null;

  const editors = room.members.filter((m) => m.role === "editor");

  const viewers = room.members.filter((m) => m.role === "viewer");

  let newOwner = null;

  if (editors.length > 0) {
    newOwner = editors[0];
  } else if (viewers.length > 0) {
    newOwner = viewers[0];
  }

  if (!newOwner) return null;

  room.ownerId = newOwner.userId;

  room.members.forEach((member) => {
    if (member.userId === newOwner.userId) {
      member.role = "owner";
    } else if (member.role === "owner") {
      member.role = "editor";
    }
  });

  await room.save();

  return newOwner;
};

const getRoom = async (roomId) => {
  return await Room.findOne({ roomId });
};
module.exports = {
  createRoom,
  joinRoom,
  updateRoomCode,
  changeUserRole,
  removeUser,
  transferOwnership,
  deleteRoom,
  autoTransferOwnership,
  getRoom
};
