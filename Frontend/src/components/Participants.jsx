import { useEffect, useState } from "react";

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
    <section className="panel participants-panel">
      <div className="participant-list">
        {members.map((member) => {
          const isCurrentUser = member.userId === currentUserId;
          const isLoading = actionUserId === member.userId;
          const isMenuOpen = openMenuUserId === member.userId;
          const avatarColor = getAvatarColor(member.displayName || "User");
          const initial = (member.displayName || "U")[0]?.toUpperCase();

          return (
            <article key={member.userId} className={`participant-card ${isCurrentUser ? "participant-card--self" : ""}`}>
              <div className="participant-main">
                <div className="participant-avatar" style={{ backgroundColor: avatarColor }}>
                  {initial}
                  <span className="participant-status-dot" />
                </div>

                <div className="participant-info">
                  <div className="participant-title-row">
                    <h4>{member.displayName}</h4>
                    {isCurrentUser ? <span className="self-badge">You</span> : null}
                  </div>
                  <span className="participant-role-subtext">{member.role}</span>
                </div>

                <div className="participant-badges">
                  <span className={`role-pill role-${member.role}`}>{member.role}</span>
                  {isOwner && !isCurrentUser ? (
                    <div className="participant-menu-wrap">
                      <button
                        type="button"
                        className="participant-menu-trigger"
                        onClick={() => toggleMenu(member.userId)}
                        aria-label={`Open actions for ${member.displayName}`}
                      >
                        <span />
                        <span />
                        <span />
                      </button>

                      {isMenuOpen ? (
                        <div className="participant-menu">
                          <label className="participant-menu-label">Change Role</label>
                          <select
                            value={member.role}
                            onChange={(event) => {
                              onChangeRole(member.userId, event.target.value);
                              setOpenMenuUserId(null);
                            }}
                            disabled={isLoading}
                          >
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                          </select>
                          <button
                            type="button"
                            className="participant-menu-action"
                            disabled={isLoading}
                            onClick={() => {
                              onTransferOwnership(member.userId);
                              setOpenMenuUserId(null);
                            }}
                          >
                            Transfer Owner
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
                            Remove
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
