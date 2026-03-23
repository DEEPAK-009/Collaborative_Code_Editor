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
  const [success, setSuccess] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const hasLocalPassword = user?.authProviders?.includes("local");

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
    setSuccess("");
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
    setSuccess("");
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

  const handlePasswordUpdate = async () => {
    setError("");
    setSuccess("");

    if (hasLocalPassword && !currentPassword.trim()) {
      setError("Current password is required.");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password must match.");
      return;
    }

    setIsUpdatingPassword(true);

    try {
      await updateProfile({
        currentPassword: currentPassword.trim(),
        password: newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordOpen(false);
      setSuccess(hasLocalPassword ? "Password updated." : "Password added.");
    } catch (requestError) {
      setError(requestError.error || requestError.message || "Unable to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <section className="dashboard-shell">
        <div className="dashboard-topbar">
          <div>
            <p className="dashboard-kicker">Workspace</p>
            <h1>{welcomeName}</h1>
          </div>
          <div className="dashboard-topbar-actions">
            <button
              type="button"
              className="ghost-button"
              onClick={() => {
                setError("");
                setSuccess("");
                setIsPasswordOpen((currentValue) => !currentValue);
              }}
            >
              {isPasswordOpen ? "Close password" : "Change password"}
            </button>
            <button type="button" className="danger-button" onClick={handleSignOut}>
              Sign out
            </button>
          </div>
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
          {success ? <div className="dashboard-success">{success}</div> : null}
        </div>

        {isPasswordOpen ? (
          <div className="dashboard-password-card">
            <div className="dashboard-password-copy">
              <p className="dashboard-kicker">
                {hasLocalPassword ? "Security" : "Add local login"}
              </p>
              <h2>{hasLocalPassword ? "Change password" : "Set password"}</h2>
            </div>

            <div className="dashboard-password-grid">
              {hasLocalPassword ? (
                <input
                  className="dashboard-input"
                  type="password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              ) : null}
              <input
                className="dashboard-input"
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
              />
              <input
                className="dashboard-input"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </div>

            <div className="dashboard-password-actions">
              <button
                type="button"
                className="dashboard-btn btn-blue dashboard-btn-inline"
                onClick={handlePasswordUpdate}
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? "Saving..." : "Update password"}
              </button>
            </div>
          </div>
        ) : null}

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
