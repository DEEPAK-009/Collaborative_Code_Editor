import { useEffect, useRef } from "react";

const Chat = ({
  currentUserId,
  input,
  isConnected,
  messages,
  onInputChange,
  onSend,
}) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="panel chat-panel">
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Conversation</p>
          <h3>Room chat</h3>
        </div>
        <span className={`status-pill ${isConnected ? "online" : "offline"}`}>
          {isConnected ? "Live" : "Offline"}
        </span>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-state">
            Messages for this room will appear here once someone starts talking.
          </div>
        ) : null}

        {messages.map((message) => {
          const isMine = message.userId === currentUserId;

          return (
            <div
              key={message.id || `${message.userId}-${message.createdAt}`}
              className={`chat-row ${isMine ? "chat-row--mine" : ""}`}
            >
              <div className={`chat-bubble ${isMine ? "mine" : ""}`}>
                <div className="chat-meta">
                  <span>{message.displayName}</span>
                  <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
                </div>
                <p>{message.message || " "}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-composer">
        <input
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder="Type a message..."
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
        />
        <button onClick={onSend} disabled={!input.trim() || !isConnected}>
          Send
        </button>
      </div>
    </section>
  );
};

export default Chat;
