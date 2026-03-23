const crypto = require("crypto");
const Room = require("../models/Room");
const ChatMessage = require("../models/ChatMessage");
const User = require("../models/User");
const { getDisplayName } = require("../utils/jwt");

const ROOM_ID_LENGTH = 6;
const ROOM_ID_CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ROLE_ORDER = {
  owner: 0,
  editor: 1,
  viewer: 2,
};

const createRoomId = () =>
  Array.from(crypto.randomBytes(ROOM_ID_LENGTH))
    .map((value) => ROOM_ID_CHARSET[value % ROOM_ID_CHARSET.length])
    .join("");

const findUserOrThrow = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const findRoomOrThrow = async (roomId) => {
  const room = await Room.findOne({ roomId });

  if (!room) {
    throw new Error("Room not found");
  }

  return room;
};

const findMember = (room, userId) =>
  room.members.find((member) => member.userId === userId);

const ensureOwner = (room, actorId) => {
  if (room.ownerId !== actorId) {
    throw new Error("Only the room owner can perform this action");
  }
};

const pickNextOwner = (room) => {
  const editors = room.members.filter((member) => member.role === "editor");
  const viewers = room.members.filter((member) => member.role === "viewer");

  return editors[0] || viewers[0] || null;
};

const serializeRoom = (room, activeUsers = []) => {
  const activeUserIds = new Set(activeUsers.map((activeUser) => activeUser.userId));

  return {
    id: room._id.toString(),
    roomId: room.roomId,
    ownerId: room.ownerId,
    language: room.language || "javascript",
    code: room.code || "",
    createdAt: room.createdAt,
    updatedAt: room.updatedAt,
    members: [...room.members]
      .map((member) => ({
        userId: member.userId,
        displayName: member.displayName,
        role: member.role,
        isActive: activeUserIds.has(member.userId),
      }))
      .sort((left, right) => {
        if (ROLE_ORDER[left.role] !== ROLE_ORDER[right.role]) {
          return ROLE_ORDER[left.role] - ROLE_ORDER[right.role];
        }

        return left.displayName.localeCompare(right.displayName);
      }),
    activeUsers,
  };
};

const createRoom = async (ownerId) => {
  const user = await findUserOrThrow(ownerId);

  let roomId = createRoomId();

  while (await Room.exists({ roomId })) {
    roomId = createRoomId();
  }

  const room = new Room({
    roomId,
    ownerId,
    members: [
      {
        userId: ownerId,
        displayName: getDisplayName(user),
        role: "owner",
      },
    ],
    code: "",
    language: "javascript",
  });

  await room.save();

  return room;
};

const joinRoom = async (roomId, userId) => {
  const user = await findUserOrThrow(userId);
  const room = await findRoomOrThrow(roomId);

  const displayName = getDisplayName(user);
  const existingMember = findMember(room, userId);

  if (!existingMember) {
    room.members.push({
      userId,
      displayName,
      role: "editor",
    });
  } else {
    existingMember.displayName = displayName;
  }

  await room.save();
  return room;
};

const getRoom = async (roomId) => Room.findOne({ roomId });

const assertRoomMember = async (roomId, userId) => {
  const room = await findRoomOrThrow(roomId);
  const member = findMember(room, userId);

  if (!member) {
    throw new Error("You are not a member of this room");
  }

  return { room, member };
};

const updateRoomCode = async (roomId, code, language) => {
  const updates = {
    code,
  };

  if (language) {
    updates.language = language;
  }

  const room = await Room.findOneAndUpdate({ roomId }, updates, { new: true });
  return room;
};

const changeUserRole = async ({ roomId, actorId, targetUserId, newRole }) => {
  if (!["editor", "viewer"].includes(newRole)) {
    throw new Error("Invalid role");
  }

  const room = await findRoomOrThrow(roomId);
  ensureOwner(room, actorId);

  if (room.ownerId === targetUserId) {
    throw new Error("Transfer ownership before changing the owner's role");
  }

  const member = findMember(room, targetUserId);

  if (!member) {
    throw new Error("User not in room");
  }

  member.role = newRole;

  await room.save();
  return room;
};

const removeUser = async ({ roomId, actorId, targetUserId }) => {
  const room = await findRoomOrThrow(roomId);
  ensureOwner(room, actorId);

  if (room.ownerId === targetUserId) {
    throw new Error("Transfer ownership before removing the owner");
  }

  const member = findMember(room, targetUserId);

  if (!member) {
    throw new Error("User not in room");
  }

  room.members = room.members.filter((item) => item.userId !== targetUserId);

  await room.save();

  return room;
};

const transferOwnership = async ({ roomId, actorId, newOwnerId }) => {
  const room = await findRoomOrThrow(roomId);
  ensureOwner(room, actorId);

  const newOwner = findMember(room, newOwnerId);

  if (!newOwner) {
    throw new Error("User not in room");
  }

  room.ownerId = newOwnerId;

  room.members.forEach((member) => {
    if (member.userId === newOwnerId) {
      member.role = "owner";
    } else if (member.userId === actorId) {
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

const leaveRoom = async (roomId, userId) => {
  const room = await findRoomOrThrow(roomId);
  const leavingMember = findMember(room, userId);

  if (!leavingMember) {
    return {
      deleted: false,
      ownershipTransferredTo: null,
      room,
    };
  }

  const wasOwner = room.ownerId === userId;

  room.members = room.members.filter((member) => member.userId !== userId);

  if (room.members.length === 0) {
    await deleteRoom(roomId);
    return {
      deleted: true,
      ownershipTransferredTo: null,
      room: null,
    };
  }

  let ownershipTransferredTo = null;

  if (wasOwner) {
    const newOwner = pickNextOwner(room);

    if (!newOwner) {
      await deleteRoom(roomId);
      return {
        deleted: true,
        ownershipTransferredTo: null,
        room: null,
      };
    }

    ownershipTransferredTo = {
      userId: newOwner.userId,
      displayName: newOwner.displayName,
      role: "owner",
    };

    room.ownerId = newOwner.userId;

    room.members.forEach((member) => {
      if (member.userId === newOwner.userId) {
        member.role = "owner";
      }
    });
  }

  await room.save();

  return {
    deleted: false,
    ownershipTransferredTo,
    room,
  };
};

module.exports = {
  assertRoomMember,
  createRoom,
  changeUserRole,
  deleteRoom,
  getRoom,
  joinRoom,
  leaveRoom,
  removeUser,
  serializeRoom,
  transferOwnership,
  updateRoomCode,
};
