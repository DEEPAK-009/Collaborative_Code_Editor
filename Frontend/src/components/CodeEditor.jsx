const CodeEditor = ({ code, setCode, roomId }) => {
  const handleChange = (e) => {
    const newCode = e.target.value;

    setCode(newCode);

    socket.emit("code-change", {
      roomId,
      code: newCode,
    });
  };

  return (
    <textarea
      value={code}
      onChange={handleChange}
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