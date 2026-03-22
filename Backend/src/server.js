require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const socketHandler = require("./sockets/socketHandler");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 6050;

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.set("io", io);

// 🔐 Socket Authentication Middleware
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

// Socket events
socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
