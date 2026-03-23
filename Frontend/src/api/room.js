import API from "./axios";

export const createRoom = (ownerId,username, token) => {
  return API.post(
    "/rooms",
    { ownerId, 
      username
     },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const joinRoom = (roomId, userId,username,  token) => {
  return API.get(`/rooms/${roomId}`, {
    data: { userId , username},
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};