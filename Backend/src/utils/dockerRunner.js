const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const languageConfig = require("./languageConfig");

const runCode = (language, code) => {

  return new Promise((resolve, reject) => {

    const config = languageConfig[language];

    if (!config) {
      return reject("Unsupported language");
    }

    const jobId = uuidv4();

    const dirPath = path.resolve(__dirname, "../../temp", jobId);

    fs.mkdirSync(dirPath, { recursive: true });

    console.log("Directory Path:", dirPath);

    const filePath = path.join(dirPath, config.filename);

    fs.writeFileSync(filePath, code);

    const dockerCommand = `docker run --rm \
    --memory="128m" \
    --cpus="0.5" \
    --network=none \
    -v "${dirPath}:/app" \
    -w /app \
    ${config.image} sh -c "${config.run}"`;

    console.log("Running command:", dockerCommand);
    console.log(`Executing ${language} code in container`);
    
    exec(dockerCommand, { timeout: 5000 }, (error, stdout, stderr) => {

      console.log("STDOUT:", stdout);
      console.log("STDERR:", stderr);
      fs.rmSync(dirPath, { recursive: true, force: true });

      if (error) {
        if (error.killed) {
            return resolve("Execution timed out");
        }
        return resolve(stderr || error.message);
      }

      // if program produced error output
        if (stderr) {
            return resolve(stderr);
        }
      resolve(stdout);

    });

  });
};

module.exports = runCode;