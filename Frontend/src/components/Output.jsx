const Output = ({ executionEnabled, isRunning, output }) => {
  return (
    <section className="panel output-panel">
      <div className="panel-header">
        <h3>Output</h3>
        <span
          className={`status-pill ${
            executionEnabled ? (isRunning ? "running" : "idle") : "offline"
          }`}
        >
          {executionEnabled ? (isRunning ? "Running" : "Ready") : "Disabled"}
        </span>
      </div>

      <pre>
        {output ||
          (executionEnabled
            ? "Run the current file to see output here."
            : "Code execution is disabled in the hosted demo. Use the local Docker setup to run code.")}
      </pre>
    </section>
  );
};

export default Output;
