import API from "./axios";

export const runCode = (language, code, token) => {
  return API.post(
    "/execute",
    {
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