import API from "./axios";

export const runCode = (roomId, language, code) => {
  return API.post(
    "/execute",
    {
      roomId,
      language,
      code
    }
  ).then((response) => response.data);
};
