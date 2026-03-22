import socket from "../socket/socket";
import { useRef } from "react";

const CodeEditor = ({ code, setCode, roomId , joined}) => {

  const handleChange = (e) => {
    const newCode = e.target.value;

    setCode(newCode);
    if (!joined) return;
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