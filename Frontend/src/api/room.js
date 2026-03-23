import API from "./axios";

export const createRoom = () =>
  API.post("/rooms").then((response) => response.data);

export const getRoom = (roomId) =>
  API.get(`/rooms/${roomId}`).then((response) => response.data);

export const joinRoom = (roomId) =>
  API.post(`/rooms/${roomId}/join`).then((response) => response.data);

export const changeRoomRole = (roomId, userId, role) =>
  API.patch(`/rooms/${roomId}/members/${userId}/role`, { role }).then(
    (response) => response.data
  );

export const removeRoomUser = (roomId, userId) =>
  API.delete(`/rooms/${roomId}/members/${userId}`).then(
    (response) => response.data
  );

export const transferRoomOwnership = (roomId, newOwnerId) =>
  API.post(`/rooms/${roomId}/transfer-ownership`, { newOwnerId }).then(
    (response) => response.data
  );
