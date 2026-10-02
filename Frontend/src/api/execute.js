import API from "./axios";

export const getExecutionUsage = () => {
  return API.get("/execute/usage").then((response) => response.data);
};

export const runCode = (roomId, language, code, input = "") => {
  return API.post("/execute", {
    roomId,
    language,
    code,
    input,
  }).then((response) => response.data);
};
