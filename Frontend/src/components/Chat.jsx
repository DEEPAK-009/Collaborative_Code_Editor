import { useEffect, useRef } from "react";

const AVATAR_COLORS = [
  "#3b82f6",
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
];

const getAvatarColor = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

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
    <section className="chat-panel">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="chat-empty-icon">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h4>No messages yet</h4>
            <p>Send a message to start coordinating with your team.</p>
          </div>
        ) : null}

        {messages.map((message) => {
          const isMine = message.userId === currentUserId;
          const avatarColor = getAvatarColor(message.displayName || "User");
          const initial = (message.displayName || "U")[0]?.toUpperCase();
          const timeStr = message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <div
              key={message.id || `${message.userId}-${message.createdAt}`}
              className={`chat-row ${isMine ? "chat-row--mine" : ""}`}
            >
              {!isMine && (
                <div
                  className="chat-msg-avatar"
                  style={{ backgroundColor: avatarColor }}
                  title={message.displayName}
                >
                  {initial}
                </div>
              )}
              <div className={`chat-bubble ${isMine ? "chat-bubble--mine" : ""}`}>
                {!isMine && (
                  <div className="chat-meta">
                    <span className="chat-sender-name">{message.displayName}</span>
                    <span className="chat-time">{timeStr}</span>
                  </div>
                )}
                <p className="chat-msg-text">{message.message || " "}</p>
                {isMine && timeStr && (
                  <div className="chat-meta-mine">
                    <span>{timeStr}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-composer-wrapper">
        <form
          className="chat-composer"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim() && isConnected) {
              onSend();
            }
          }}
        >
          <input
            type="text"
            className="chat-input"
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder={isConnected ? "Type a message..." : "Reconnecting..."}
            disabled={!isConnected}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={!input.trim() || !isConnected}
            title="Send message (Enter)"
            aria-label="Send message"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
};

export default Chat;

