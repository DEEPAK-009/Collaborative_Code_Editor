module.exports = {
  javascript: {
    image: "node:18",
    filename: "main.js",
    run: "node main.js",
  },

  python: {
    image: "python:3",
    filename: "main.py",
    run: "python main.py",
  },

  cpp: {
    image: "gcc:latest",
    filename: "main.cpp",
    run: "g++ main.cpp -o main && ./main",
  },

  java: {
    image: "openjdk:17",
    filename: "Main.java",
    run: "javac Main.java && java Main",
  },
  go: {
    image: "golang:1.21",
    filename: "main.go",
    run: "go run main.go",
  },
  rust: {
    image: "rust:latest",
    filename: "main.rs",
    run: "rustc main.rs && ./main",
  },
};
