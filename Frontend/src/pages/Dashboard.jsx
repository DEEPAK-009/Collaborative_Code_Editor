import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../api/room";
import { AuthContext } from "../context/AuthContext";

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
    <div className="flex flex-col items-center justify-center h-screen gap-10">

      {/* JOIN ROOM */}
      <div className="border p-6 rounded w-80">
        <h2 className="text-xl font-bold mb-4">Have a room code?</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Enter name"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="border p-2 w-full mb-3"
          placeholder="Enter room code"
          onChange={(e) => setRoomCode(e.target.value)}
        />

        <button
          onClick={handleJoinRoom}
          className="bg-blue-500 text-white p-2 w-full"
        >
          Join Room
        </button>
      </div>

      {/* CREATE ROOM */}
      <div className="border p-6 rounded w-80">
        <h2 className="text-xl font-bold mb-4">Create a new room</h2>

        <input
          className="border p-2 w-full mb-3"
          placeholder="Enter name"
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleCreateRoom}
          className="bg-green-500 text-white p-2 w-full"
        >
          Create Room
        </button>
      </div>

    </div>
  );
};

export default Dashboard;