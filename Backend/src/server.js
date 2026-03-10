// Client
//    ↓
// HTTP Server
//    ↓
// Express + Socket.IO

require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const socketHandler = require("./sockets/socketHandler");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 6000;

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});
socketHandler(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});