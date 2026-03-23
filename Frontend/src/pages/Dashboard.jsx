
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../api/room";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [username, setUsername] = useState(""); // ✅ renamed + used properly
  const [roomCode, setRoomCode] = useState("");

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const userId = JSON.parse(atob(token.split(".")[1])).id;

  const handleCreateRoom = async () => {
    if (!username.trim()) {
      alert("Enter your name");
      return;
    }
    try {
      const res = await createRoom(userId, username , token);
      localStorage.setItem("username", username);
      navigate(`/editor/${res.data.roomId}`, {
        state: { username }, // ✅ PASS USERNAME
      });
    } catch (err) {
      alert("Error creating room");
    }
  };

  const handleJoinRoom = async () => {
    if (!username.trim()) {
      alert("Enter your name");
      return;
    }
    try {
      await joinRoom(roomCode, userId,username,  token);
      localStorage.setItem("username", username);
      navigate(`/editor/${roomCode}`, {
        state: { username }, // ✅ PASS USERNAME
      });
    } catch (err) {
      alert("Room not found");
    }
  };

  return (
    <div className="dashboard-wrapper">

      {/* JOIN ROOM */}
      <div className="dashboard-card card-glow-blue">
        <h2 className="dashboard-title">
          Join <span className="blue">Workspace</span>
        </h2>

        <input
          className="dashboard-input focus-blue"
          placeholder="Display Name"
          value={username} // ✅ bind value
          onChange={(e) => setUsername(e.target.value)} // ✅ update username
        />

        <input
          className="dashboard-input focus-blue"
          placeholder="Room ID"
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button
          onClick={handleJoinRoom}
          className="dashboard-btn btn-blue"
        >
          Connect
        </button>
      </div>

      {/* CREATE ROOM */}
      <div className="dashboard-card card-glow-green">
        <h2 className="dashboard-title">
          New <span className="green">Workspace</span>
        </h2>

        <input
          className="dashboard-input focus-green"
          placeholder="Display Name"
          value={username} // ✅ bind value
          
          onChange={(e) => setUsername(e.target.value)} // ✅ update username
        />

        <button
          onClick={handleCreateRoom}
          className="dashboard-btn btn-green mt-[60px]"
        >
          Initialize
        </button>
      </div>

    </div>
  );
};

export default Dashboard;