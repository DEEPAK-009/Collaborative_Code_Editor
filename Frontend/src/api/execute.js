import API from "./axios";

export const runCode = (roomId, language, code, token) => {
  return API.post(
    "/execute",
    {
      roomId, 
      language,
      code
    },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};