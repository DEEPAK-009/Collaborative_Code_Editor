const Output = ({ isRunning, output }) => {
  return (
    <section className="panel output-panel">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Execution</p>
          <h3>Runtime output</h3>
        </div>
        <span className={`status-pill ${isRunning ? "running" : "idle"}`}>
          {isRunning ? "Running" : "Ready"}
        </span>
      </div>

      <pre>{output || "Run the current file to see output here."}</pre>
    </section>
  );
};

export default Output;
