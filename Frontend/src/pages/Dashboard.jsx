import { useContext, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { createRoom, joinRoom } from "../api/room";
import { AuthContext } from "../context/auth-context";
import Logo from "../components/Logo";
import "../styles/dashboard.css";

const Dashboard = () => {
  const { logout, updateProfile, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [joinError, setJoinError] = useState(location.state?.error || "");
  const [success, setSuccess] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const hasLocalPassword = user?.authProviders?.includes("local");

  const welcomeName = useMemo(
    () =>
      displayName.trim() ||
      user?.displayName ||
      user?.email?.split("@")[0] ||
      "Developer",
    [displayName, user]
  );

  const initials = useMemo(() => {
    const parts = welcomeName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (welcomeName[0] || "D").toUpperCase();
  }, [welcomeName]);

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
    setJoinError("");
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
    setJoinError("");
    setSuccess("");
    setIsJoining(true);

    try {
      await syncDisplayName();
      const normalizedRoomCode = roomCode.trim().toUpperCase();
      if (!normalizedRoomCode) {
        throw new Error("Please enter a Room ID");
      }
      const response = await joinRoom(normalizedRoomCode);
      navigate(`/editor/${normalizedRoomCode}`, {
        state: { initialRoom: response.room },
      });
    } catch (requestError) {
      setJoinError(requestError.message || requestError.error || "Room not found. Please check the code.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleSignOut = () => {
    if (!window.confirm("Sign out of CollabX?")) {
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
      setSuccess(hasLocalPassword ? "Password updated successfully." : "Password set successfully.");
    } catch (requestError) {
      setError(requestError.error || requestError.message || "Unable to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-shell">
        {/* Top Navigation Bar */}
        <header className="dashboard-topbar">
          <div className="dashboard-brand-header">
            <Link to="/" className="dashboard-brand-link" title="Return to home">
              <Logo size={42} textColor="#162032" accentColor="#1667ff" />
            </Link>
            <div className="dashboard-brand-divider" />
            <span className="dashboard-badge-pill">Workspace Hub</span>
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
              {isPasswordOpen ? "Close Security" : "Security"}
            </button>
            <button
              type="button"
              className="exit-button"
              onClick={handleSignOut}
              aria-label="Sign out of CollabX"
              title="Sign out of CollabX"
            >
              <span className="door-icon" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </header>

        {/* Global Error / Success Toasts */}
        {error ? <div className="dashboard-error">{error}</div> : null}
        {success ? <div className="dashboard-success">{success}</div> : null}

        {/* Profile / Workspace Header Card */}
        <section className="dashboard-profile-card">
          <div className="profile-card-main">
            <div className="profile-avatar-badge">
              <span>{initials}</span>
            </div>
            <div className="profile-meta-info">
              <div className="profile-title-row">
                <h2>{welcomeName}</h2>
              </div>
              <div className="profile-subtext-row">
                <span className="profile-email-tag">{user?.email}</span>
                <span className={`profile-provider-tag ${user?.googleId ? "google-tag" : ""}`}>
                  {user?.googleId ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                      </svg>
                      <span>Google Connected</span>
                    </>
                  ) : (
                    <span>Local Account</span>
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="profile-edit-field">
            <label className="dashboard-label" htmlFor="displayName">
              Display Name (seen by room collaborators)
            </label>
            <div className="profile-input-row">
              <input
                id="displayName"
                className="dashboard-input"
                placeholder="How should other collaborators see you?"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Password Security Drawer */}
        {isPasswordOpen ? (
          <section className="dashboard-password-card">
            <div className="dashboard-password-copy">
              <p className="panel-kicker">
                {hasLocalPassword ? "Credentials" : "Local Access"}
              </p>
              <h3>{hasLocalPassword ? "Update Password" : "Set Account Password"}</h3>
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
                placeholder="New password (min. 6 chars)"
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
                {isUpdatingPassword ? "Saving..." : "Save Password"}
              </button>
            </div>
          </section>
        ) : null}

        {/* Action Cards: Create & Join Rooms */}
        <section className="dashboard-grid">
          {/* Create Room Card */}
          <div className="dashboard-card card-glow-green">
            <div className="card-top-icon green-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <div className="dashboard-card-copy">
              <p className="panel-kicker green-kicker">New Session</p>
              <h3 className="dashboard-title">
                Create <span className="green">Room</span>
              </h3>
              <p className="dashboard-card-desc">
                Launch a clean real-time collaborative workspace with code sync, live chat, multi-user cursors, and Docker compilation.
              </p>
            </div>

            <button
              onClick={handleCreateRoom}
              className="dashboard-btn btn-green"
              disabled={isCreating}
            >
              {isCreating ? "Initializing Workspace..." : "Create Room"}
            </button>
          </div>

          {/* Join Room Card */}
          <div className="dashboard-card card-glow-blue">
            <div className="card-top-icon blue-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
            </div>
            <div className="dashboard-card-copy">
              <p className="panel-kicker blue-kicker">Collaboration</p>
              <h3 className="dashboard-title">
                Join <span className="blue">Room</span>
              </h3>
              <p className="dashboard-card-desc">
                Enter a 6-character room code provided by a team member to jump straight into an active coding session.
              </p>
            </div>

            <div className="room-input-container">
              <input
                className={`dashboard-input room-code-input focus-blue ${joinError ? "input-has-error" : ""}`}
                placeholder="e.g. 7A9B2C"
                value={roomCode}
                maxLength={10}
                onChange={(event) => {
                  setRoomCode(event.target.value.toUpperCase());
                  if (joinError) setJoinError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleJoinRoom();
                }}
              />
              <button
                onClick={handleJoinRoom}
                className="dashboard-btn btn-blue"
                disabled={isJoining || !roomCode.trim()}
              >
                {isJoining ? "Connecting..." : "Join Room"}
              </button>
            </div>
            {joinError ? (
              <div className="room-inline-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{joinError}</span>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
