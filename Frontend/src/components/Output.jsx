const Output = ({
  executionEnabled,
  isRunning,
  output,
  input = "",
  onInputChange,
  activeTab = "output",
  onTabChange,
}) => {
  return (
    <div className="output-shell">
      <div className="output-shell-header">
        <div className="output-tab-group">
          <button
            type="button"
            className={`output-tab-btn ${activeTab === "output" ? "active" : ""}`}
            onClick={() => onTabChange?.("output")}
          >
            <span className="output-terminal-dot" />
            <span>Output</span>
          </button>
          <button
            type="button"
            className={`output-tab-btn ${activeTab === "input" ? "active" : ""}`}
            onClick={() => onTabChange?.("input")}
          >
            <span>Input (stdin)</span>
            {input.trim() ? (
              <span className="input-active-dot" title="Custom input provided" />
            ) : null}
          </button>
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
        {activeTab === "output" ? (
          <pre className="output-terminal-text">
            {output ||
              (executionEnabled
                ? "⚡ Run the current file to see execution output here."
                : "Code execution is disabled in the hosted demo. Use the local Docker setup to run code.")}
          </pre>
        ) : (
          <div className="output-input-area">
            <textarea
              className="output-stdin-textarea"
              placeholder="Enter custom input (stdin) for your program here (e.g. numbers, test cases, strings)..."
              value={input}
              onChange={(e) => onInputChange?.(e.target.value)}
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Output;
