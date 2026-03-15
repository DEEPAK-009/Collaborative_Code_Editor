import API from "./axios";

export const createRoom = (ownerId, token) => {
  return API.post(
    "/rooms",
    { ownerId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const joinRoom = (roomId, userId, token) => {
  return API.get(`/rooms/${roomId}`, {
    data: { userId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};