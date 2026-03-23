const Header = ({
  canEdit,
  connectionStatus,
  isRunning,
  language,
  onBackToDashboard,
  onRun,
  roomId,
  setLanguage,
  userRole,
}) => {
  let statusLabel = "Reconnecting";

  if (connectionStatus === "connected") {
    statusLabel = "Live";
  } else if (connectionStatus === "connecting") {
    statusLabel = "Connecting";
  }

  return (
    <header className="editor-header">
      <div className="editor-header__section editor-header__section--left">
        <button
          type="button"
          className="icon-button"
          onClick={onBackToDashboard}
          aria-label="Leave room and return to dashboard"
          title="Leave room and return to dashboard"
        >
          <span className="door-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
        <div className="workspace-chip">
          <p className="panel-kicker">Workspace</p>
          <h1>{roomId}</h1>
        </div>
      </div>

      <div className="editor-header__section editor-header__section--center">
        <select value={language} onChange={(event) => setLanguage(event.target.value)}>
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
        </select>

        <button type="button" onClick={onRun} disabled={isRunning || !canEdit}>
          {isRunning ? "Running..." : "Run code"}
        </button>
      </div>

      <div className="editor-header__section editor-header__section--right">
        <div className="editor-header__meta">
          <span className={`status-pill ${connectionStatus}`}>{statusLabel}</span>
          <span className={`role-pill role-${userRole || "viewer"}`}>
            {userRole || "viewer"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
