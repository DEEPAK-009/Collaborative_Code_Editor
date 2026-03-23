require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const socketHandler = require("./sockets/socketHandler");
const { Server } = require("socket.io");
const { verifyAuthToken } = require("./utils/jwt");

const PORT = process.env.PORT || 6050;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URL,
    credentials: true,
  },
});

app.set("io", io);

io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }
    const decoded = verifyAuthToken(token);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
