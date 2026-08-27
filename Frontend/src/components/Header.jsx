import Logo from "./Logo";

const Header = ({
  canEdit,
  executionEnabled,
  isRunning,
  language,
  onBackToDashboard,
  onRun,
  roomId,
  setLanguage,
}) => {
  return (
    <header className="editor-header">
      <div className="editor-header__section editor-header__section--left">
        <div className="workspace-chip">
          <Logo size={38} showText={false} />
          <div className="workspace-chip-info">
            <p className="panel-kicker">Workspace</p>
            <h1>{roomId}</h1>
          </div>
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

        {executionEnabled ? (
          <button type="button" onClick={onRun} disabled={isRunning || !canEdit}>
            {isRunning ? "Running..." : "Run code"}
          </button>
        ) : (
          <span className="status-pill idle">Demo mode</span>
        )}
      </div>

      <div className="editor-header__section editor-header__section--right">
        <button
          type="button"
          className="exit-button"
          onClick={onBackToDashboard}
          aria-label="Leave room and return to dashboard"
          title="Leave room and return to dashboard"
        >
          <span className="door-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
