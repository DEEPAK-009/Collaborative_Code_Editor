const Output = ({ output }) => {
  return (
    <div
      style={{
        height: "200px",
        borderTop: "1px solid gray",
        padding: "10px",
        overflow: "auto"
      }}
    >
      <pre>{output}</pre>
    </div>
  );
};

export default Output;