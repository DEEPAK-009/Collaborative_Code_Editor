import { useEffect, useRef } from "react";

const AVATAR_COLORS = [
  "#2563eb",
  "#059669",
  "#7c3aed",
  "#d97706",
  "#db2777",
  "#0891b2",
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
    <section className="panel chat-panel">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty-state">
            <div className="chat-empty-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
              </svg>
            </div>
            <h4>No messages yet</h4>
            <p>Start a conversation with your team.</p>
          </div>
        ) : null}

        {messages.map((message) => {
          const isMine = message.userId === currentUserId;
          const avatarColor = getAvatarColor(message.displayName || "User");
          const initial = (message.displayName || "U")[0]?.toUpperCase();
          const timeStr = message.createdAt
            ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "";

          return (
            <div
              key={message.id || `${message.userId}-${message.createdAt}`}
              className={`chat-row ${isMine ? "chat-row--mine" : ""}`}
            >
              {!isMine && (
                <div className="chat-msg-avatar" style={{ backgroundColor: avatarColor }} title={message.displayName}>
                  {initial}
                </div>
              )}
              <div className={`chat-bubble ${isMine ? "mine" : ""}`}>
                {!isMine && (
                  <div className="chat-meta">
                    <span className="chat-sender-name">{message.displayName}</span>
                    <span className="chat-time">{timeStr}</span>
                  </div>
                )}
                <p>{message.message || " "}</p>
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

      <div className="chat-composer">
        <input
          value={input}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder={isConnected ? "Type a message..." : "Reconnecting..."}
          disabled={!isConnected}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
        />
        <button
          className="chat-send-btn"
          onClick={onSend}
          disabled={!input.trim() || !isConnected}
          title="Send message"
          aria-label="Send message"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Chat;
