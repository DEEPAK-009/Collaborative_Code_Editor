module.exports = {
  javascript: {
    image: "node:18",
    filename: () => "main.js",
    run: () => "node main.js",
  },

  python: {
    image: "python:3",
    filename: () => "main.py",
    run: () => "python main.py",
  },

  cpp: {
    image: "gcc:latest",
    filename: () => "main.cpp",
    run: () => "g++ main.cpp -o main && ./main",
  },

  java: {
    image: "eclipse-temurin:17-jdk",
    filename: (code) => {
      const publicClassMatch = code.match(/\bpublic\s+class\s+([A-Za-z_]\w*)/);
      const classMatch = code.match(/\bclass\s+([A-Za-z_]\w*)/);
      const className = publicClassMatch?.[1] || classMatch?.[1] || "Main";

      return `${className}.java`;
    },
    run: ({ filename }) => {
      const className = filename.replace(/\.java$/, "");
      return `javac ${filename} && java ${className}`;
    },
  },
  go: {
    image: "golang:1.21",
    filename: () => "main.go",
    run: () => "go run main.go",
  },
  rust: {
    image: "rust:latest",
    filename: () => "main.rs",
    run: () => "rustc main.rs -o app && ./app",
  },
};
