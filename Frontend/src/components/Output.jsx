const Output = ({ executionEnabled, isRunning, output }) => {
  return (
    <div className="output-shell">
      <div className="output-shell-header">
        <div className="output-title-chip">
          <span className="output-terminal-dot" />
          <span className="output-shell-title">Output</span>
        </div>
        {isRunning ? (
          <div className="output-header-actions">
            <span className="output-status-running">
              <span className="output-spinner" /> Running...
            </span>
          </div>
        ) : null}
      </div>

      <div className="output-content-area">
        <pre className="output-terminal-text">
          {output ||
            (executionEnabled
              ? "⚡ Run the current file to see execution output here."
              : "Code execution is disabled in the hosted demo. Use the local Docker setup to run code.")}
        </pre>
      </div>
    </div>
  );
};

export default Output;
