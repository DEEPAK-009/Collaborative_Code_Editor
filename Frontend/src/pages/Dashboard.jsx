
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../api/room";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboard.css"; // <-- Don't forget the import!

const Dashboard = () => {
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const userId = JSON.parse(atob(token.split(".")[1])).id;

  const handleCreateRoom = async () => {
    try {
      const res = await createRoom(userId, token);
      navigate(`/editor/${res.data.roomId}`);
    } catch (err) {
      alert("Error creating room");
    }
  };

  const handleJoinRoom = async () => {
    try {
      await joinRoom(roomCode, userId, token);
      navigate(`/editor/${roomCode}`);
    } catch (err) {
      alert("Room not found");
    }
  };

  return (
    <div className="dashboard-wrapper">

      {/* JOIN ROOM */}
      <div className="dashboard-card card-glow-blue">
        <h2 className="dashboard-title">Join <span className="blue">Workspace</span></h2>

        <input
          className="dashboard-input focus-blue"
          placeholder="Display Name"
          onChange={(e) => setName(e.target.value)}
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
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Connect
        </button>
      </div>

      {/* CREATE ROOM */}
      <div className="dashboard-card card-glow-green">
        <h2 className="dashboard-title">New <span className="green">Workspace</span></h2>

        <input
          className="dashboard-input focus-green"
          placeholder="Display Name"
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleCreateRoom}
          className="dashboard-btn btn-green mt-[60px]" /* margin to align with the Join button since it has one less input */
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Initialize
        </button>
      </div>

    </div>
  );
};

export default Dashboard;