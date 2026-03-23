const Participants = ({
  actionUserId,
  currentUserId,
  isOwner,
  members,
  onChangeRole,
  onRemoveUser,
  onTransferOwnership,
}) => {
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

          return (
            <article key={member.userId} className="participant-card">
              <div className="participant-main">
                <div>
                  <div className="participant-title-row">
                    <h4>{member.displayName}</h4>
                    {isCurrentUser ? <span className="self-badge">You</span> : null}
                  </div>
                  <p>{member.isActive ? "Active now" : "Away"}</p>
                </div>

                <div className="participant-badges">
                  <span className={`role-pill role-${member.role}`}>{member.role}</span>
                  <span className={`status-pill ${member.isActive ? "online" : "offline"}`}>
                    {member.isActive ? "Online" : "Offline"}
                  </span>
                </div>
              </div>

              {isOwner && !isCurrentUser ? (
                <div className="participant-actions">
                  <select
                    value={member.role}
                    onChange={(event) => onChangeRole(member.userId, event.target.value)}
                    disabled={isLoading}
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    type="button"
                    className="ghost-button"
                    disabled={isLoading}
                    onClick={() => onTransferOwnership(member.userId)}
                  >
                    Transfer owner
                  </button>
                  <button
                    type="button"
                    className="danger-button"
                    disabled={isLoading}
                    onClick={() => onRemoveUser(member.userId)}
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Participants;
