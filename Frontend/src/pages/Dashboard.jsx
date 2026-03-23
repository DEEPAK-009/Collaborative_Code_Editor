import { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();
  const navigate = useNavigate();

  const welcomeName = useMemo(
    () =>
      displayName.trim() ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
      "builder",
    [displayName, user]
  );

  const pageError = location.state?.error || error;

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

  const handleSignOut = () => {
    if (!window.confirm("Sign out now?")) {
      return;
    }

    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="dashboard-wrapper">
      <section className="dashboard-shell">
        <div className="dashboard-topbar">
          <div>
            <p className="dashboard-kicker">Workspace</p>
            <h1>{welcomeName}</h1>
          </div>
          <button type="button" className="ghost-button" onClick={handleSignOut}>
            Sign out
          </button>
        </div>

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
            <span>Update once, used in every room</span>
          </div>
          {pageError ? <div className="dashboard-error">{pageError}</div> : null}
        </div>

        <section className="dashboard-grid">
          <div className="dashboard-card card-glow-blue">
            <div className="dashboard-card-copy">
              <p className="dashboard-card-tag">Join</p>
              <h2 className="dashboard-title">
                Existing <span className="blue">Room</span>
              </h2>
            </div>

            <input
              className="dashboard-input focus-blue"
              placeholder="Room ID"
              value={roomCode}
              onChange={(event) => setRoomCode(event.target.value.toUpperCase())}
            />

            <button onClick={handleJoinRoom} className="dashboard-btn btn-blue" disabled={isJoining}>
              {isJoining ? "Connecting..." : "Join room"}
            </button>
          </div>

          <div className="dashboard-card card-glow-green">
            <div className="dashboard-card-copy">
              <p className="dashboard-card-tag">Create</p>
              <h2 className="dashboard-title">
                New <span className="green">Room</span>
              </h2>
            </div>

            <button onClick={handleCreateRoom} className="dashboard-btn btn-green" disabled={isCreating}>
              {isCreating ? "Initializing..." : "Create room"}
            </button>
          </div>
        </section>
      </section>
    </div>
  );
};

export default Dashboard;
