const runCode = require("../utils/dockerRunner");

const executeCode = async (language, code, input = "") => {
  const output = await runCode(language, code, input);
  return output;
};

module.exports = {
  executeCode
};