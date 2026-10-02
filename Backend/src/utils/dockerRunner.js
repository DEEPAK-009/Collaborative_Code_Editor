const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const languageConfig = require("./languageConfig");

const runCode = (language, code, input = "") => {
  return new Promise((resolve, reject) => {
    const config = languageConfig[language];

    if (!config) {
      return reject("Unsupported language");
    }

    const jobId = uuidv4();

    const tempRoot = process.env.CODE_EXECUTION_TMP_DIR
      ? path.resolve(process.env.CODE_EXECUTION_TMP_DIR)
      : path.resolve(__dirname, "../../temp");

    const dirPath = path.join(tempRoot, jobId);

    fs.mkdirSync(dirPath, { recursive: true });

    console.log("Directory Path:", dirPath);

    const filename =
      typeof config.filename === "function" ? config.filename(code) : config.filename;
    const runCommand =
      typeof config.run === "function"
        ? config.run({ code, filename })
        : config.run;

    const filePath = path.join(dirPath, filename);
    const inputPath = path.join(dirPath, "input.txt");

    fs.writeFileSync(filePath, code);
    fs.writeFileSync(inputPath, typeof input === "string" ? input : "");

    const dockerCommand = `docker run --rm \
    --memory="128m" \
    --cpus="0.5" \
    --network=none \
    -v "${dirPath}:/app" \
    -w /app \
    ${config.image} sh -c "${runCommand} < input.txt"`;

    exec(
      dockerCommand,
      { timeout: 60000, maxBuffer: 1024 * 1024 },
      (error, stdout, stderr) => {
        fs.rmSync(dirPath, { recursive: true, force: true });

        if (error) {
          if (error.killed) {
            return resolve("Execution timed out");
          }

          return resolve(stderr || error.message);
        }

        if (stderr) {
          return resolve(stderr);
        }

        resolve(stdout || "Program finished with no output.");
      }
    );
  });
};

module.exports = runCode;
