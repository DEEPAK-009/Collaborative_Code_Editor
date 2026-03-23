const Header = ({
  canEdit,
  connectionStatus,
  isRunning,
  language,
  onBackToDashboard,
  onLeave,
  onRun,
  roomId,
  setLanguage,
  userRole,
}) => {
  return (
    <header className="editor-header">
      <div className="editor-header__section editor-header__section--left">
        <button type="button" className="ghost-button" onClick={onBackToDashboard}>
          Back to dashboard
        </button>
        <div>
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
          <span className={`status-pill ${connectionStatus}`}>{connectionStatus}</span>
          <span className={`role-pill role-${userRole || "viewer"}`}>
            {userRole || "viewer"}
          </span>
        </div>
        <button type="button" className="danger-button" onClick={onLeave}>
          Sign out
        </button>
      </div>
    </header>
  );
};

export default Header;
