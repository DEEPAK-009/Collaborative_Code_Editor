const LANGUAGE_ID_MAP = {
  javascript: 63, // Node.js 12.14.0 (or 93 for 18.15.0 on newer instances)
  python: 71,     // Python 3.8.1 (or 92 for 3.11.2)
  cpp: 54,        // C++ GCC 9.2.0
  java: 62,       // Java OpenJDK 13.0.1
  go: 60,         // Go 1.13.5
  rust: 73,       // Rust 1.40.0
  c: 50,          // C GCC 9.2.0
  typescript: 74, // TypeScript 3.7.4
};

const decodeBase64 = (str) => {
  if (!str) return "";
  try {
    return Buffer.from(str, "base64").toString("utf-8");
  } catch {
    return str;
  }
};

const encodeBase64 = (str) => {
  return Buffer.from(typeof str === "string" ? str : "").toString("base64");
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getJudge0Headers = () => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (process.env.JUDGE0_API_KEY) {
    headers["X-RapidAPI-Key"] = process.env.JUDGE0_API_KEY;
    headers["X-Auth-Token"] = process.env.JUDGE0_API_KEY;
  }

  if (process.env.JUDGE0_API_HOST) {
    headers["X-RapidAPI-Host"] = process.env.JUDGE0_API_HOST;
  }

  if (process.env.JUDGE0_AUTH_TOKEN) {
    headers["X-Auth-Token"] = process.env.JUDGE0_AUTH_TOKEN;
  }

  return headers;
};

const formatJudge0Result = (data) => {
  const stdout = decodeBase64(data.stdout);
  const stderr = decodeBase64(data.stderr);
  const compileOutput = decodeBase64(data.compile_output);
  const message = decodeBase64(data.message);
  const status = data.status || {};

  // Status IDs:
  // 1: In Queue, 2: Processing, 3: Accepted, 4: Wrong Answer, 5: Time Limit Exceeded
  // 6: Compilation Error, 7-12: Runtime Errors, 13: Internal Error, 14: Exec Format Error

  if (status.id === 6 || compileOutput) {
    return compileOutput || "Compilation Error";
  }

  if (status.id === 5) {
    return "Execution timed out (Time Limit Exceeded)";
  }

  if (status.id >= 7 && status.id <= 14) {
    return stderr || message || status.description || "Runtime Error";
  }

  if (stderr) {
    return stderr;
  }

  if (stdout) {
    return stdout;
  }

  if (status.description && status.id !== 3) {
    return `[${status.description}] ${message || ""}`.trim();
  }

  return "Program completed with no output.";
};

const runCodeWithJudge0 = async (language, code, input = "") => {
  const languageId = LANGUAGE_ID_MAP[language?.toLowerCase()];

  if (!languageId) {
    throw new Error(`Unsupported language for Judge0: ${language}`);
  }

  const baseUrl = (
    process.env.JUDGE0_API_URL || "https://ce.judge0.com"
  ).replace(/\/+$/, "");

  const headers = getJudge0Headers();

  const payload = {
    language_id: languageId,
    source_code: encodeBase64(code),
    stdin: encodeBase64(input),
    cpu_time_limit: Number(process.env.JUDGE0_CPU_TIME_LIMIT) || 10,
    memory_limit: Number(process.env.JUDGE0_MEMORY_LIMIT) || 128000,
  };

  const submitUrl = `${baseUrl}/submissions?base64_encoded=true&wait=true`;

  const response = await fetch(submitUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Judge0 API error (${response.status}): ${errorText}`);
  }

  let data = await response.json();

  // If the status is still In Queue (1) or Processing (2), poll for completion
  if (data.status?.id === 1 || data.status?.id === 2) {
    const token = data.token;
    if (token) {
      const maxAttempts = 10;
      for (let i = 0; i < maxAttempts; i++) {
        await sleep(500);
        const pollUrl = `${baseUrl}/submissions/${token}?base64_encoded=true`;
        const pollRes = await fetch(pollUrl, { method: "GET", headers });
        if (pollRes.ok) {
          data = await pollRes.json();
          if (data.status?.id && data.status.id > 2) {
            break;
          }
        }
      }
    }
  }

  return formatJudge0Result(data);
};

module.exports = {
  LANGUAGE_ID_MAP,
  runCodeWithJudge0,
};
