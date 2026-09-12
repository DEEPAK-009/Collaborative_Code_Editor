import { useEffect, useState } from "react";

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

const ROLE_ICONS = {
  owner: "👑",
  editor: "✏️",
  viewer: "👁️",
};

const Participants = ({
  actionUserId,
  currentUserId,
  isOwner,
  members,
  onChangeRole,
  onRemoveUser,
  onTransferOwnership,
}) => {
  const [openMenuUserId, setOpenMenuUserId] = useState(null);

  const toggleMenu = (userId) => {
    setOpenMenuUserId((currentUserIdValue) =>
      currentUserIdValue === userId ? null : userId
    );
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!event.target.closest(".participant-menu-wrap")) {
        setOpenMenuUserId(null);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  return (
    <section className="participants-panel">
      <div className="participant-header-meta">
        <span className="participant-count-tag">
          {members.length} {members.length === 1 ? "Member" : "Members"}
        </span>
        <span className="participant-hint">Realtime Collaborative Presence</span>
      </div>

      <div className="participant-list">
        {members.map((member) => {
          const isCurrentUser = member.userId === currentUserId;
          const isLoading = actionUserId === member.userId;
          const isMenuOpen = openMenuUserId === member.userId;
          const avatarColor = getAvatarColor(member.displayName || "User");
          const initial = (member.displayName || "U")[0]?.toUpperCase();
          const role = member.role || "viewer";

          return (
            <article
              key={member.userId}
              className={`participant-card ${
                isCurrentUser ? "participant-card--self" : ""
              }`}
            >
              <div className="participant-main">
                <div
                  className="participant-avatar"
                  style={{ backgroundColor: avatarColor }}
                >
                  {initial}
                  <span className="participant-status-dot" title="Online" />
                </div>

                <div className="participant-info">
                  <div className="participant-title-row">
                    <h4 className="participant-name" title={member.displayName}>
                      {member.displayName}
                    </h4>
                    {isCurrentUser ? (
                      <span className="self-badge">YOU</span>
                    ) : null}
                  </div>
                  <div className="participant-status-subtext">
                    <span className="online-indicator">Online</span>
                  </div>
                </div>

                <div className="participant-badges">
                  <span className={`role-pill role-${role}`}>
                    <span className="role-icon">{ROLE_ICONS[role] || "•"}</span>
                    <span>{role}</span>
                  </span>

                  {isOwner && !isCurrentUser ? (
                    <div className="participant-menu-wrap">
                      <button
                        type="button"
                        className="participant-menu-trigger"
                        onClick={() => toggleMenu(member.userId)}
                        aria-label={`Open actions for ${member.displayName}`}
                        title="Manage participant"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
                        </svg>
                      </button>

                      {isMenuOpen ? (
                        <div className="participant-menu">
                          <div className="participant-menu-header">
                            <span>Manage Role</span>
                          </div>

                          <div className="participant-menu-select-wrap">
                            <select
                              value={role}
                              onChange={(event) => {
                                onChangeRole(member.userId, event.target.value);
                                setOpenMenuUserId(null);
                              }}
                              disabled={isLoading}
                              className="participant-role-select"
                            >
                              <option value="editor">✏️ Editor (Can edit)</option>
                              <option value="viewer">👁️ Viewer (Read only)</option>
                            </select>
                          </div>

                          <div className="participant-menu-divider" />

                          <button
                            type="button"
                            className="participant-menu-action"
                            disabled={isLoading}
                            onClick={() => {
                              onTransferOwnership(member.userId);
                              setOpenMenuUserId(null);
                            }}
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 2l3 6 6 1-4.5 4.5 1 6.5-5.5-3-5.5 3 1-6.5-4.5-4.5 6-1z" />
                            </svg>
                            <span>Transfer Owner</span>
                          </button>

                          <button
                            type="button"
                            className="participant-menu-action participant-menu-action--danger"
                            disabled={isLoading}
                            onClick={() => {
                              onRemoveUser(member.userId);
                              setOpenMenuUserId(null);
                            }}
                          >
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                            <span>Remove from Room</span>
                          </button>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Participants;

