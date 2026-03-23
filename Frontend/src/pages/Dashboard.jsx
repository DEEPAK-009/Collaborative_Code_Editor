import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, joinRoom } from "../api/room";
import { AuthContext } from "../context/auth-context";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { logout, updateProfile, user } = useContext(AuthContext);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  const welcomeName = useMemo(
    () =>
      displayName.trim() ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
      "builder",
    [displayName, user]
  );

  const syncDisplayName = async () => {
    const trimmedName = displayName.trim();

    if (!trimmedName) {
      throw new Error("Display name is required");
    }

    if (trimmedName !== user?.displayName) {
      await updateProfile({ displayName: trimmedName });
    }
  };

  const handleCreateRoom = async () => {
    setError("");
    setIsCreating(true);

    try {
      await syncDisplayName();
      const response = await createRoom();
      navigate(`/editor/${response.room.roomId}`, {
        state: { initialRoom: response.room },
      });
    } catch (requestError) {
      setError(requestError.error || requestError.message || "Unable to create room.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    setError("");
    setIsJoining(true);

    try {
      await syncDisplayName();
      const normalizedRoomCode = roomCode.trim().toUpperCase();
      const response = await joinRoom(normalizedRoomCode);
      navigate(`/editor/${normalizedRoomCode}`, {
        state: { initialRoom: response.room },
      });
    } catch (requestError) {
      setError(requestError.message || requestError.error || "Unable to join room.");
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <section className="dashboard-hero">
        <p className="dashboard-kicker">Collaborative code editor</p>
        <h1>Ship code in shared rooms without losing realtime context.</h1>
        <p className="dashboard-lede">
          {welcomeName}, choose whether you want to launch a fresh workspace or
          attach to an existing room with chat, runtime output, roles, and live
          cursors already wired in.
        </p>

        <div className="dashboard-profile-card">
          <label className="dashboard-label" htmlFor="displayName">
            Display name
          </label>
          <input
            id="displayName"
            className="dashboard-input"
            placeholder="How should other collaborators see you?"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
          <div className="dashboard-profile-meta">
            <span>{user?.email}</span>
            <button type="button" className="ghost-button" onClick={logout}>
              Sign out
            </button>
          </div>
          {error ? <div className="dashboard-error">{error}</div> : null}
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="dashboard-card card-glow-blue">
          <div className="dashboard-card-copy">
            <p className="dashboard-card-tag">Existing room</p>
            <h2 className="dashboard-title">
              Join <span className="blue">Workspace</span>
            </h2>
            <p>
              Reconnect to a room using its code and restore live editing,
              messages, and member presence.
            </p>
          </div>

          <input
            className="dashboard-input focus-blue"
            placeholder="Room ID"
            value={roomCode}
            onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
          />

          <button onClick={handleJoinRoom} className="dashboard-btn btn-blue" disabled={isJoining}>
            {isJoining ? "Connecting..." : "Connect"}
          </button>
        </div>

        <div className="dashboard-card card-glow-green">
          <div className="dashboard-card-copy">
            <p className="dashboard-card-tag">Fresh session</p>
            <h2 className="dashboard-title">
              New <span className="green">Workspace</span>
            </h2>
            <p>
              Spin up a new room, become its owner, and invite collaborators with
              a single room ID.
            </p>
          </div>

          <button onClick={handleCreateRoom} className="dashboard-btn btn-green" disabled={isCreating}>
            {isCreating ? "Initializing..." : "Initialize"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
