const Output = ({ executionEnabled, isRunning, output }) => {
  return (
    <section className="panel output-panel">
      <div className="output-panel-header">
        <h3>Output</h3>
        {isRunning && <span className="output-status-running">Running...</span>}
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
