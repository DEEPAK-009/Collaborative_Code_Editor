const CodeEditor = ({ code, setCode }) => {
  return (
    <textarea
      value={code}
      onChange={(e) => setCode(e.target.value)}
      style={{
        width: "100%",
        height: "100%",
        padding: "10px",
        fontFamily: "monospace"
      }}
    />
  );
};

export default CodeEditor;