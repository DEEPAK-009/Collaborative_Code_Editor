const runWithDocker = require("../utils/dockerRunner");
const { runCodeWithJudge0 } = require("../utils/judge0Runner");

const getExecutionProvider = () => {
  return (process.env.EXECUTION_PROVIDER || "judge0").trim().toLowerCase();
};

const executeCode = async (language, code, input = "") => {
  const provider = getExecutionProvider();

  if (provider === "docker") {
    return await runWithDocker(language, code, input);
  }

  try {
    return await runCodeWithJudge0(language, code, input);
  } catch (error) {
    console.error("Judge0 execution error:", error.message);

    if (process.env.ENABLE_DOCKER_FALLBACK === "true") {
      console.log("Falling back to local Docker runner...");
      return await runWithDocker(language, code, input);
    }

    throw error;
  }
};

module.exports = {
  executeCode,
  getExecutionProvider,
};