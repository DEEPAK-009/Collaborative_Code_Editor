import API from "./axios";

export const runCode = (roomId, language, code, input = "") => {
  return API.post(
    "/execute",
    {
      roomId,
      language,
      code,
      input,
    }
  ).then((response) => response.data);
};
