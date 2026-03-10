// Server startup only

require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const PORT = process.env.PORT || 5050;

const server = http.createServer(app);

const connectDB = require("./config/db");

connectDB();

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

