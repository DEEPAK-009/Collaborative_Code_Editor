import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { createRoom, joinRoom } from "../api/room";
import { AuthContext } from "../context/auth-context";
import Logo from "../components/Logo";
import "../styles/dashboard.css";
import "../styles/dashboard.mobile.css";

const Dashboard = () => {
  const { updateProfile, user } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [joinError, setJoinError] = useState(location.state?.error || "");
  const [passwordError, setPasswordError] = useState("");
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

  useEffect(() => {
    if (!isPasswordOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsPasswordOpen(false);
        setPasswordError("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPasswordOpen]);

  const handlePasswordUpdate = async () => {
    setPasswordError("");
    setError("");
    setSuccess("");

    if (hasLocalPassword && !currentPassword.trim()) {
      setPasswordError("Current password is required.");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password must match.");
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
      setPasswordError("");
      setIsPasswordOpen(false);
      setSuccess(hasLocalPassword ? "Password updated successfully." : "Password set successfully.");
    } catch (requestError) {
      setPasswordError(requestError.error || requestError.message || "Unable to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-shell">
        {/* Global Error / Success Toasts */}
        {error ? <div className="dashboard-error">{error}</div> : null}
        {success ? <div className="dashboard-success">{success}</div> : null}

        {/* Floating Top Navigation (Logo & Home Button outside the box) */}
        <header className="dashboard-top-nav">
          <Link to="/" className="dashboard-floating-brand" title="CollabX Homepage">
            <Logo size={42} textColor="#ffffff" />
          </Link>

          <div className="dashboard-top-nav__actions">
            <Link to="/" className="dashboard-home-nav-btn" title="Back to Homepage">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </Link>
          </div>
        </header>

        <div className="dashboard-layout-card">
          {/* Left Sidebar */}
          <aside className="dashboard-sidebar">
            <div className="dashboard-sidebar__top">
              <div className="dashboard-user-info">
                <div className="dashboard-user-avatar" aria-hidden="true">
                  {welcomeName.charAt(0).toUpperCase()}
                </div>
                <h3 className="dashboard-user-name">{welcomeName}</h3>
                <p className="dashboard-user-email">{user?.email}</p>
              </div>

              <div className="dashboard-field-group">
                <label className="dashboard-field-label" htmlFor="displayName">
                  DISPLAY NAME
                </label>
                <div className="dashboard-input-icon-wrap">
                  <svg
                    className="dashboard-input-icon"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    id="displayName"
                    className="dashboard-input dashboard-input--with-icon"
                    placeholder="Display name"
                    value={displayName}
                    onChange={(event) => setDisplayName(event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="dashboard-sidebar__bottom">
              <button
                type="button"
                className={`dashboard-security-btn ${isPasswordOpen ? "active" : ""}`}
                onClick={() => {
                  setError("");
                  setSuccess("");
                  setPasswordError("");
                  setCurrentPassword("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setIsPasswordOpen(true);
                }}
              >
                <svg
                  className="security-shield-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                  <circle cx="12" cy="11" r="2" />
                  <path d="M12 13v3" />
                </svg>
                <span>Security</span>
              </button>
            </div>
          </aside>

          {/* Right Main Content */}
          <main className="dashboard-main-area">
            <div className="dashboard-hero-header">
              <h2 className="dashboard-hero-title">Welcome to your workspace.</h2>
              <p className="dashboard-hero-desc">
                Choose an option below to start collaborating with your team.
              </p>
            </div>

            <div className="dashboard-cards-grid">
              {/* Create Room Card */}
              {/* Create Room Card */}
              <div className="dashboard-action-card create-card">
                <div className="action-card-body">
                  <div className="action-card-icon green-icon">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>

                  <div className="action-card-header">
                    <h3 className="action-card-title">Create Room</h3>
                    <span className="action-card-badge-new">NEW</span>
                  </div>
                </div>

                <div className="action-card-bottom">
                  <button
                    type="button"
                    onClick={handleCreateRoom}
                    className="dashboard-action-btn btn-initialize-session"
                    disabled={isCreating}
                  >
                    <span>{isCreating ? "Initializing Workspace..." : "Initialize Session →"}</span>
                  </button>
                </div>
              </div>

              {/* Join Room Card */}
              <div className="dashboard-action-card join-card">
                <div className="action-card-body">
                  <div className="action-card-icon blue-icon">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
                    </svg>
                  </div>

                  <div className="action-card-header">
                    <h3 className="action-card-title">Join Room</h3>
                  </div>

                  <div className="action-card-input-wrap">
                    <input
                      className={`dashboard-input dashboard-room-code-input ${joinError ? "input-has-error" : ""}`}
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
                      spellCheck={false}
                      autoComplete="off"
                    />
                    {joinError && (
                      <div className="room-inline-error">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span>{joinError}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="action-card-bottom">
                  <button
                    type="button"
                    onClick={handleJoinRoom}
                    className="dashboard-action-btn btn-join-session"
                    disabled={isJoining || !roomCode.trim()}
                  >
                    <span>{isJoining ? "Connecting..." : "Join Session"}</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Security Popup Modal */}
      {isPasswordOpen && (
        <div
          className="dashboard-modal-backdrop"
          onClick={() => {
            setIsPasswordOpen(false);
            setPasswordError("");
          }}
          role="presentation"
        >
          <div
            className="dashboard-modal-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="security-modal-title"
          >
            <div className="dashboard-modal-header">
              <div className="dashboard-modal-title-group">
                <div className="dashboard-modal-icon-badge">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
                    <circle cx="12" cy="11" r="2" />
                    <path d="M12 13v3" />
                  </svg>
                </div>
                <div>
                  <p className="panel-kicker">
                    {hasLocalPassword ? "Credentials" : "Local Access"}
                  </p>
                  <h3 id="security-modal-title">
                    {hasLocalPassword ? "Update Password" : "Set Account Password"}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                className="dashboard-modal-close"
                onClick={() => {
                  setIsPasswordOpen(false);
                  setPasswordError("");
                }}
                aria-label="Close security modal"
              >
                ✕
              </button>
            </div>

            <div className="dashboard-modal-body">
              {passwordError && (
                <div className="dashboard-modal-error">{passwordError}</div>
              )}

              <div className="dashboard-modal-form-group">
                {hasLocalPassword && (
                  <div className="dashboard-modal-field">
                    <label htmlFor="modal-current-password">Current Password</label>
                    <input
                      id="modal-current-password"
                      className="dashboard-input"
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassword}
                      onChange={(event) => {
                        setPasswordError("");
                        setCurrentPassword(event.target.value);
                      }}
                    />
                  </div>
                )}

                <div className="dashboard-modal-field">
                  <label htmlFor="modal-new-password">New Password</label>
                  <input
                    id="modal-new-password"
                    className="dashboard-input"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(event) => {
                      setPasswordError("");
                      setNewPassword(event.target.value);
                    }}
                  />
                </div>

                <div className="dashboard-modal-field">
                  <label htmlFor="modal-confirm-password">Confirm Password</label>
                  <input
                    id="modal-confirm-password"
                    className="dashboard-input"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(event) => {
                      setPasswordError("");
                      setConfirmPassword(event.target.value);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handlePasswordUpdate();
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="dashboard-modal-footer">
              <button
                type="button"
                className="dashboard-btn dashboard-btn-secondary"
                onClick={() => {
                  setIsPasswordOpen(false);
                  setPasswordError("");
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="dashboard-btn btn-save-password"
                onClick={handlePasswordUpdate}
                disabled={isUpdatingPassword}
              >
                {isUpdatingPassword ? (
                  <>
                    <span className="btn-spinner" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                      <polyline points="17 21 17 13 7 13 7 21" />
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    <span>Save Password</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
