import { useEffect, useState, useRef, useContext } from "react";
import socket from "../socket/socket";
import { AuthContext } from "../context/AuthContext";

const Chat = ({ roomId }) => {
  const { user } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef();

  // 🔹 Load old messages
  useEffect(() => {
    socket.on("chat-history", (msgs) => {
      setMessages(msgs);
    });

    return () => {
      socket.off("chat-history");
    };
  }, []);

  // 🔹 Listen for new messages
  useEffect(() => {
    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  // 🔹 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Send message
  const handleSend = () => {
    if (!input.trim()) return;

    socket.emit("send-message", {
      roomId,
      message: input,
    });

    setInput("");
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", borderLeft: "1px solid gray" }}>
      
      {/* MESSAGES */}
      <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
        {messages.map((msg, index) => {
          const isMe = msg.userId === user?.id;

          return (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  background: isMe ? "#4caf50" : "#444",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  maxWidth: "70%",
                }}
              >
                <div style={{ fontSize: "12px", opacity: 0.7 }}>
                  {msg.username}
                </div>
                <div>{msg.message}</div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={{ display: "flex", borderTop: "1px solid gray" }}>
        <input
          style={{ flex: 1, padding: "10px", border: "none" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} style={{ padding: "10px" }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;