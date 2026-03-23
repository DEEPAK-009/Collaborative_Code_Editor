import { useEffect, useState } from "react";

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
      <div className="panel-header">
        <div>
          <p className="panel-kicker">Participants</p>
          <h3>{members.length} collaborators</h3>
        </div>
      </div>

      <div className="participant-list">
        {members.map((member) => {
          const isCurrentUser = member.userId === currentUserId;
          const isLoading = actionUserId === member.userId;
          const isMenuOpen = openMenuUserId === member.userId;

          return (
            <article key={member.userId} className="participant-card">
              <div className="participant-main">
                <div className="participant-info">
                  <div className="participant-title-row">
                    <h4>{member.displayName}</h4>
                    {isCurrentUser ? <span className="self-badge">You</span> : null}
                  </div>
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
                            className="ghost-button"
                            disabled={isLoading}
                            onClick={() => {
                              onTransferOwnership(member.userId);
                              setOpenMenuUserId(null);
                            }}
                          >
                            Transfer owner
                          </button>
                          <button
                            type="button"
                            className="danger-button"
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
