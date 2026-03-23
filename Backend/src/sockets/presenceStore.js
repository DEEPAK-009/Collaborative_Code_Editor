const roomPresence = new Map();
const socketIndex = new Map();
const disconnectTimers = new Map();

const getTimerKey = (roomId, userId) => `${roomId}:${userId}`;

const getOrCreateRoom = (roomId) => {
  if (!roomPresence.has(roomId)) {
    roomPresence.set(roomId, new Map());
  }

  return roomPresence.get(roomId);
};

const addSocketToRoom = ({ roomId, userId, socketId, displayName, role }) => {
  const room = getOrCreateRoom(roomId);
  const existing = room.get(userId) || {
    userId,
    displayName,
    role,
    socketIds: new Set(),
  };

  existing.displayName = displayName;
  existing.role = role;
  existing.socketIds.add(socketId);

  room.set(userId, existing);
  socketIndex.set(socketId, { roomId, userId });
};

const removeSocket = (socketId) => {
  const socketMeta = socketIndex.get(socketId);

  if (!socketMeta) {
    return null;
  }

  socketIndex.delete(socketId);

  const room = roomPresence.get(socketMeta.roomId);

  if (!room) {
    return {
      ...socketMeta,
      hasRemainingUserSockets: false,
    };
  }

  const activeUser = room.get(socketMeta.userId);

  if (!activeUser) {
    return {
      ...socketMeta,
      hasRemainingUserSockets: false,
    };
  }

  activeUser.socketIds.delete(socketId);

  const hasRemainingUserSockets = activeUser.socketIds.size > 0;

  if (!hasRemainingUserSockets) {
    room.delete(socketMeta.userId);
  }

  if (room.size === 0) {
    roomPresence.delete(socketMeta.roomId);
  }

  return {
    ...socketMeta,
    hasRemainingUserSockets,
  };
};

const getActiveUsers = (roomId) => {
  const room = roomPresence.get(roomId);

  if (!room) {
    return [];
  }

  return Array.from(room.values())
    .map(({ socketIds, ...activeUser }) => ({
      ...activeUser,
      socketCount: socketIds.size,
    }))
    .sort((left, right) => {
      if (left.role === "owner" && right.role !== "owner") return -1;
      if (left.role !== "owner" && right.role === "owner") return 1;
      return left.displayName.localeCompare(right.displayName);
    });
};

const getActiveUser = (roomId, userId) => {
  const room = roomPresence.get(roomId);
  const activeUser = room?.get(userId);

  if (!activeUser) {
    return null;
  }

  return {
    userId: activeUser.userId,
    displayName: activeUser.displayName,
    role: activeUser.role,
    socketCount: activeUser.socketIds.size,
  };
};

const hasActiveUserInRoom = (roomId, userId) =>
  roomPresence.get(roomId)?.has(userId) ?? false;

const getUserSocketIds = (roomId, userId) => {
  const room = roomPresence.get(roomId);
  const activeUser = room?.get(userId);

  return activeUser ? Array.from(activeUser.socketIds) : [];
};

const setUserRole = (roomId, userId, role) => {
  const room = roomPresence.get(roomId);
  const activeUser = room?.get(userId);

  if (activeUser) {
    activeUser.role = role;
  }
};

const setUserDisplayName = (roomId, userId, displayName) => {
  const room = roomPresence.get(roomId);
  const activeUser = room?.get(userId);

  if (activeUser) {
    activeUser.displayName = displayName;
  }
};

const removeUser = (roomId, userId) => {
  const room = roomPresence.get(roomId);
  const activeUser = room?.get(userId);

  if (!activeUser) {
    return [];
  }

  room.delete(userId);

  for (const socketId of activeUser.socketIds) {
    socketIndex.delete(socketId);
  }

  if (room.size === 0) {
    roomPresence.delete(roomId);
  }

  clearDisconnectCleanup(roomId, userId);

  return Array.from(activeUser.socketIds);
};

const clearRoom = (roomId) => {
  const room = roomPresence.get(roomId);

  if (room) {
    for (const activeUser of room.values()) {
      for (const socketId of activeUser.socketIds) {
        socketIndex.delete(socketId);
      }
    }

    roomPresence.delete(roomId);
  }

  for (const timerKey of disconnectTimers.keys()) {
    if (timerKey.startsWith(`${roomId}:`)) {
      clearTimeout(disconnectTimers.get(timerKey));
      disconnectTimers.delete(timerKey);
    }
  }
};

const scheduleDisconnectCleanup = (roomId, userId, callback, delayMs) => {
  clearDisconnectCleanup(roomId, userId);

  const timerKey = getTimerKey(roomId, userId);
  const timer = setTimeout(async () => {
    disconnectTimers.delete(timerKey);
    await callback();
  }, delayMs);

  disconnectTimers.set(timerKey, timer);
};

const clearDisconnectCleanup = (roomId, userId) => {
  const timerKey = getTimerKey(roomId, userId);
  const timer = disconnectTimers.get(timerKey);

  if (timer) {
    clearTimeout(timer);
    disconnectTimers.delete(timerKey);
  }
};

module.exports = {
  addSocketToRoom,
  clearDisconnectCleanup,
  clearRoom,
  getActiveUser,
  getActiveUsers,
  getUserSocketIds,
  hasActiveUserInRoom,
  removeSocket,
  removeUser,
  scheduleDisconnectCleanup,
  setUserDisplayName,
  setUserRole,
};
