import { io } from "socket.io-client";
import { BACKEND_URL } from "../api/axios";

const socket = io(BACKEND_URL, {
  autoConnect: false,
  reconnection: true,
  transports: ["websocket"],
});

export default socket;
