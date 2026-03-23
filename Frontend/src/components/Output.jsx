const Output = ({ isRunning, output }) => {
  return (
    <section className="panel output-panel">
      <div className="panel-header">
        <h3>Output</h3>
        <span className={`status-pill ${isRunning ? "running" : "idle"}`}>
          {isRunning ? "Running" : "Ready"}
        </span>
      </div>

      <pre>{output || "Run the current file to see output here."}</pre>
    </section>
  );
};

export default Output;
