const runCode = require("../utils/dockerRunner");

const executeCode = async (language, code) => {
  const output = await runCode(language, code);
  return output;
};

module.exports = {
  executeCode
};