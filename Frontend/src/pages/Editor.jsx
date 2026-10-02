import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getExecutionUsage, runCode } from "../api/execute";
import {
  changeRoomRole,
  getRoom,
  removeRoomUser,
  transferRoomOwnership,
} from "../api/room";
import { AuthContext } from "../context/auth-context";
import socket from "../socket/socket";
import Header from "../components/Header";
import CodeEditor from "../components/CodeEditor";
import Chat from "../components/Chat";
import Participants from "../components/Participants";
import Output from "../components/Output";
import "../styles/editor.css";
import "../styles/editor.mobile.css";

const executionEnabled = true;

const Editor = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useContext(AuthContext);

  const [mobileTab, setMobileTab] = useState("code");
  const [activeDrawer, setActiveDrawer] = useState(null);
  const [room, setRoom] = useState(location.state?.initialRoom || null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [outputTab, setOutputTab] = useState("output");
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [actionUserId, setActionUserId] = useState(null);
  const [presenceToasts, setPresenceToasts] = useState([]);
  const [remoteCursors, setRemoteCursors] = useState({});
  const [usage, setUsage] = useState({ used: 0, limit: 50, remaining: 50 });

  const hasJoinedRef = useRef(false);
  const codeSyncTimeoutRef = useRef(null);
  const latestCodeRef = useRef("");
  const latestLanguageRef = useRef("javascript");
  const canEditRef = useRef(false);
  const activeUsersRef = useRef([]);
  const presenceInitializedRef = useRef(false);
  const presenceToastTimeoutsRef = useRef([]);

  const currentUserId = user?.id;
  const currentMember = useMemo(
    () => room?.members.find((member) => member.userId === currentUserId),
    [currentUserId, room]
  );
  const canEdit = ["owner", "editor"].includes(currentMember?.role || "");
  const isOwner = currentMember?.role === "owner";
  const activeCursors = useMemo(
    () =>
      Object.values(remoteCursors).filter(
        (cursor) => cursor.userId !== currentUserId
      ),
    [currentUserId, remoteCursors]
  );

  const [splitRatio, setSplitRatio] = useState(() => {
    try {
      const saved = localStorage.getItem("collabx_split_ratio");
      return saved ? Math.min(Math.max(Number(saved), 20), 80) : 55;
    } catch {
      return 55;
    }
  });
  const [isDragging, setIsDragging] = useState(false);
  const layoutRef = useRef(null);

  const handleToggleDrawer = (drawerName) => {
    setActiveDrawer((current) => (current === drawerName ? null : drawerName));
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveDrawer(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Resizable Splitter Handlers (Left/Right Dragging)
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      if (!layoutRef.current) return;
      const rect = layoutRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      const newRatio = (newWidth / rect.width) * 100;
      const clampedRatio = Math.min(Math.max(newRatio, 20), 80);
      setSplitRatio(clampedRatio);
    };

    const handleTouchMove = (e) => {
      if (!layoutRef.current || !e.touches[0]) return;
      const rect = layoutRef.current.getBoundingClientRect();
      const newWidth = e.touches[0].clientX - rect.left;
      const newRatio = (newWidth / rect.width) * 100;
      const clampedRatio = Math.min(Math.max(newRatio, 20), 80);
      setSplitRatio(clampedRatio);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      try {
        localStorage.setItem("collabx_split_ratio", splitRatio);
      } catch {
        // ignore
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener("touchcancel", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("touchcancel", handleMouseUp);
    };
  }, [isDragging, splitRatio]);

  useEffect(() => {
    latestCodeRef.current = code;
  }, [code]);

  useEffect(() => {
    latestLanguageRef.current = language;
  }, [language]);

  useEffect(() => {
    canEditRef.current = canEdit;
  }, [canEdit]);

  useEffect(() => {
    return () => {
      presenceToastTimeoutsRef.current.forEach((timeoutId) => {
        window.clearTimeout(timeoutId);
      });
      presenceToastTimeoutsRef.current = [];
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getExecutionUsage()
      .then((data) => {
        if (!cancelled && data && typeof data.used === "number") {
          setUsage(data);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const initializeRoom = async () => {
      try {
        if (location.state?.initialRoom?.roomId === roomId) {
          setRoom(location.state.initialRoom);
          setCode(location.state.initialRoom.code || "");
          setLanguage(location.state.initialRoom.language || "javascript");
        }

        const response = await getRoom(roomId);

        if (cancelled) {
          return;
        }

        setRoom(response.room);
        setCode(response.room.code || "");
        setLanguage(response.room.language || "javascript");
        sessionStorage.setItem("activeRoomId", roomId);
      } catch (requestError) {
        if (cancelled) {
          return;
        }

        navigate("/dashboard", {
          replace: true,
          state: {
            error: requestError.message || requestError.error || "Unable to open the room.",
          },
        });
      }
    };

    initializeRoom();

    return () => {
      cancelled = true;
    };
  }, [location.state, navigate, roomId]);

  useEffect(() => {
    if (!token) {
      return undefined;
    }

    socket.auth = { token };

    const emitJoinEvent = () => {
      const eventName = hasJoinedRef.current ? "rejoin-room" : "join-room";
      hasJoinedRef.current = true;
      socket.emit(eventName, { roomId });
    };

    const pushPresenceToast = (message) => {
      const id = `${Date.now()}-${Math.random()}`;

      setPresenceToasts((currentToasts) => [...currentToasts, { id, message }]);

      const timeoutId = window.setTimeout(() => {
        setPresenceToasts((currentToasts) =>
          currentToasts.filter((toast) => toast.id !== id)
        );
        presenceToastTimeoutsRef.current = presenceToastTimeoutsRef.current.filter(
          (currentTimeoutId) => currentTimeoutId !== timeoutId
        );
      }, 1800);

      presenceToastTimeoutsRef.current.push(timeoutId);
    };

    const handleRoomState = ({ room: nextRoom, messages: nextMessages }) => {
      setConnectionStatus("connected");
      setError("");
      setRoom(nextRoom);
      setMessages(nextMessages);
      setCode(nextRoom.code || "");
      setLanguage(nextRoom.language || "javascript");
      activeUsersRef.current = nextRoom.activeUsers || [];
      presenceInitializedRef.current = true;
    };

    const handleRoomUpdated = (nextRoom) => {
      setRoom(nextRoom);
      setLanguage(nextRoom.language || "javascript");

      if (!nextRoom.members.some((member) => member.userId === currentUserId)) {
        sessionStorage.removeItem("activeRoomId");
        navigate("/dashboard", { replace: true });
      }
    };

    const handlePresenceUpdated = (activeUsers) => {
      const previousActiveUsers = activeUsersRef.current;

      if (presenceInitializedRef.current) {
        const previousUsersById = new Map(
          previousActiveUsers.map((activeUser) => [activeUser.userId, activeUser])
        );
        const nextUsersById = new Map(
          activeUsers.map((activeUser) => [activeUser.userId, activeUser])
        );

        activeUsers.forEach((activeUser) => {
          if (
            activeUser.userId !== currentUserId &&
            !previousUsersById.has(activeUser.userId)
          ) {
            pushPresenceToast(`${activeUser.displayName} joined`);
          }
        });

        previousActiveUsers.forEach((activeUser) => {
          if (
            activeUser.userId !== currentUserId &&
            !nextUsersById.has(activeUser.userId)
          ) {
            pushPresenceToast(`${activeUser.displayName} left`);
          }
        });
      } else {
        presenceInitializedRef.current = true;
      }

      activeUsersRef.current = activeUsers;

      setRoom((currentRoom) => {
        if (!currentRoom) {
          return currentRoom;
        }

        return {
          ...currentRoom,
          activeUsers,
        };
      });

      setRemoteCursors((currentCursors) =>
        Object.fromEntries(
          Object.entries(currentCursors).filter(([userId]) =>
            activeUsers.some((activeUser) => activeUser.userId === userId)
          )
        )
      );
    };

    const handleCodeUpdate = ({ code: nextCode, language: nextLanguage, updatedBy }) => {
      if (updatedBy === currentUserId) {
        return;
      }

      latestCodeRef.current = nextCode;
      setCode(nextCode);

      if (nextLanguage) {
        latestLanguageRef.current = nextLanguage;
        setLanguage(nextLanguage);
      }
    };

    const handleReceiveMessage = (message) => {
      setMessages((currentMessages) => [...currentMessages, message]);
    };

    const handleExecutionResult = ({ output: nextOutput }) => {
      setOutput(nextOutput);
      setIsRunning(false);
    };

    const handleExecutionUsage = (nextUsage) => {
      if (nextUsage && typeof nextUsage.used === "number") {
        setUsage(nextUsage);
      }
    };

    const handleCursorUpdate = (cursor) => {
      setRemoteCursors((currentCursors) => ({
        ...currentCursors,
        [cursor.userId]: cursor,
      }));
    };

    const handleCursorRemove = ({ userId }) => {
      setRemoteCursors((currentCursors) => {
        const nextCursors = { ...currentCursors };
        delete nextCursors[userId];
        return nextCursors;
      });
    };

    const handleRemovedFromRoom = () => {
      sessionStorage.removeItem("activeRoomId");
      navigate("/dashboard", { replace: true });
    };

    const handleRoomClosed = () => {
      sessionStorage.removeItem("activeRoomId");
      navigate("/dashboard", { replace: true });
    };

    const handleRoomError = ({ message }) => {
      setError(message);
    };

    const handleDisconnect = () => {
      setConnectionStatus("reconnecting");
    };

    const handleConnect = () => {
      setConnectionStatus("connected");
      emitJoinEvent();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("room-state", handleRoomState);
    socket.on("room-updated", handleRoomUpdated);
    socket.on("presence-updated", handlePresenceUpdated);
    socket.on("code-update", handleCodeUpdate);
    socket.on("receive-message", handleReceiveMessage);
    socket.on("execution-result", handleExecutionResult);
    socket.on("execution-usage", handleExecutionUsage);
    socket.on("cursor_update", handleCursorUpdate);
    socket.on("cursor-remove", handleCursorRemove);
    socket.on("removed-from-room", handleRemovedFromRoom);
    socket.on("room-closed", handleRoomClosed);
    socket.on("room-error", handleRoomError);

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    return () => {
      if (canEditRef.current && socket.connected) {
        socket.emit("code-change", {
          roomId,
          code: latestCodeRef.current,
          language: latestLanguageRef.current,
        });
      }

      if (codeSyncTimeoutRef.current) {
        clearTimeout(codeSyncTimeoutRef.current);
        codeSyncTimeoutRef.current = null;
      }

      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("room-state", handleRoomState);
      socket.off("room-updated", handleRoomUpdated);
      socket.off("presence-updated", handlePresenceUpdated);
      socket.off("code-update", handleCodeUpdate);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("execution-result", handleExecutionResult);
      socket.off("execution-usage", handleExecutionUsage);
      socket.off("cursor_update", handleCursorUpdate);
      socket.off("cursor-remove", handleCursorRemove);
      socket.off("removed-from-room", handleRemovedFromRoom);
      socket.off("room-closed", handleRoomClosed);
      socket.off("room-error", handleRoomError);
      socket.disconnect();
      hasJoinedRef.current = false;
      presenceInitializedRef.current = false;
      activeUsersRef.current = [];
    };
  }, [currentUserId, navigate, roomId, token]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (!canEditRef.current || !socket.connected) {
        return;
      }

      socket.emit("code-change", {
        roomId,
        code: latestCodeRef.current,
        language: latestLanguageRef.current,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [roomId]);

  const scheduleCodeSync = (nextCode, nextLanguage = language) => {
    if (!canEdit) {
      return;
    }

    if (codeSyncTimeoutRef.current) {
      clearTimeout(codeSyncTimeoutRef.current);
    }

    codeSyncTimeoutRef.current = setTimeout(() => {
      if (!socket.connected) {
        return;
      }

      socket.emit("code-change", {
        roomId,
        code: nextCode,
        language: nextLanguage,
      });
    }, 120);
  };

  const handleEditorChange = (nextCode) => {
    latestCodeRef.current = nextCode;
    setCode(nextCode);
    scheduleCodeSync(nextCode);
  };

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    latestLanguageRef.current = nextLanguage;
    scheduleCodeSync(latestCodeRef.current, nextLanguage);
  };

  const handleRun = async () => {
    if (usage && usage.remaining === 0) {
      setOutput(
        `Daily execution limit reached (${usage.used}/${usage.limit} runs today). Resets at 00:00 UTC.`
      );
      return;
    }

    try {
      setIsRunning(true);
      setOutputTab("output");
      const response = await runCode(roomId, language, code, customInput);
      setOutput(response.output);
      if (response.usage) {
        setUsage(response.usage);
      }
    } catch (requestError) {
      setOutput(requestError.error || "Execution failed");
      if (requestError.usage) {
        setUsage(requestError.usage);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !socket.connected) {
      return;
    }

    socket.emit("send-message", {
      roomId,
      message: chatInput,
    });
    setChatInput("");
  };

  const handleCursorMove = (position) => {
    if (!canEdit || !socket.connected) {
      return;
    }

    socket.emit("cursor_move", {
      roomId,
      position,
    });
  };

  const handleRoleChange = async (memberId, nextRole) => {
    setActionUserId(memberId);

    try {
      const response = await changeRoomRole(roomId, memberId, nextRole);
      setRoom(response.room);
    } catch (requestError) {
      setError(requestError.error || "Unable to update role.");
    } finally {
      setActionUserId(null);
    }
  };

  const handleRemoveUser = async (memberId) => {
    setActionUserId(memberId);

    try {
      const response = await removeRoomUser(roomId, memberId);
      setRoom(response.room);
    } catch (requestError) {
      setError(requestError.error || "Unable to remove user.");
    } finally {
      setActionUserId(null);
    }
  };

  const handleTransferOwnership = async (memberId) => {
    setActionUserId(memberId);

    try {
      const response = await transferRoomOwnership(roomId, memberId);
      setRoom(response.room);
    } catch (requestError) {
      setError(requestError.error || "Unable to transfer ownership.");
    } finally {
      setActionUserId(null);
    }
  };

  const handleLeaveRoom = () => {
    if (!window.confirm("Leave the room and go back to dashboard?")) {
      return;
    }

    if (codeSyncTimeoutRef.current) {
      clearTimeout(codeSyncTimeoutRef.current);
      codeSyncTimeoutRef.current = null;
    }

    if (canEdit && socket.connected) {
      socket.emit("code-change", {
        roomId,
        code: latestCodeRef.current,
        language: latestLanguageRef.current,
      });
    }

    socket.emit("leave-room", { roomId });
    sessionStorage.removeItem("activeRoomId");
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="editor-page">
      {presenceToasts.length > 0 ? (
        <div className="presence-toast-stack">
          {presenceToasts.map((toast) => (
            <div key={toast.id} className="presence-toast">
              {toast.message}
            </div>
          ))}
        </div>
      ) : null}

      <Header
        activeDrawer={activeDrawer}
        canEdit={canEdit}
        executionEnabled={executionEnabled}
        isRunning={isRunning}
        language={language}
        memberCount={room?.members?.length || 1}
        messageCount={messages.length}
        onBackToDashboard={handleLeaveRoom}
        onRun={handleRun}
        onToggleDrawer={handleToggleDrawer}
        roomId={roomId}
        setLanguage={handleLanguageChange}
        usage={usage}
      />

      {/* Mobile Tab Navigation Bar (Visible only on screens <= 860px) */}
      <div className="mobile-editor-tabs" role="tablist" aria-label="Editor Views">
        <button
          type="button"
          className={`mobile-tab-btn ${mobileTab === "code" && !activeDrawer ? "active" : ""}`}
          onClick={() => {
            setActiveDrawer(null);
            setMobileTab("code");
          }}
          role="tab"
          aria-selected={mobileTab === "code" && !activeDrawer}
        >
          <span>💻 Code</span>
        </button>
        <button
          type="button"
          className={`mobile-tab-btn ${mobileTab === "output" && !activeDrawer ? "active" : ""}`}
          onClick={() => {
            setActiveDrawer(null);
            setMobileTab("output");
          }}
          role="tab"
          aria-selected={mobileTab === "output" && !activeDrawer}
        >
          <span>🐳 Output</span>
        </button>
        <button
          type="button"
          className={`mobile-tab-btn ${activeDrawer === "chat" ? "active" : ""}`}
          onClick={() => handleToggleDrawer("chat")}
          role="tab"
          aria-selected={activeDrawer === "chat"}
        >
          <span>💬 Chat</span>
        </button>
        <button
          type="button"
          className={`mobile-tab-btn ${activeDrawer === "participants" ? "active" : ""}`}
          onClick={() => handleToggleDrawer("participants")}
          role="tab"
          aria-selected={activeDrawer === "participants"}
        >
          <span>👥 Team</span>
        </button>
      </div>

      <main
        ref={layoutRef}
        className={`editor-layout mobile-show-${mobileTab} ${isDragging ? "is-resizing" : ""}`}
      >
        <section
          className="editor-shell"
          style={{ flex: `0 0 calc(${splitRatio}% - 6px)` }}
        >
          <CodeEditor
            code={code}
            language={language}
            onChange={handleEditorChange}
            onCursorMove={handleCursorMove}
            readOnly={!canEdit}
            remoteCursors={activeCursors}
          />
        </section>

        <div
          className="editor-resizer"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          role="separator"
          aria-valuenow={Math.round(splitRatio)}
          aria-valuemin={20}
          aria-valuemax={80}
          aria-label="Drag left or right to resize editor and output panels"
          title="Drag left or right to resize panels"
        >
          <div className="resizer-handle" />
        </div>

        <section
          className="editor-output-section"
          style={{ flex: `0 0 calc(${100 - splitRatio}% - 6px)` }}
        >
          <Output
            executionEnabled={executionEnabled}
            isRunning={isRunning}
            output={output}
            input={customInput}
            onInputChange={setCustomInput}
            activeTab={outputTab}
            onTabChange={setOutputTab}
          />
        </section>
      </main>

      {/* Floating Pop-up for Team & Chat */}
      {activeDrawer ? (
        <div
          className="drawer-overlay"
          onClick={() => setActiveDrawer(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeDrawer === "participants" ? "Team Participants" : "Room Chat"}
        >
          <aside className="drawer-panel" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-title-group">
                <div className="drawer-icon-badge">
                  {activeDrawer === "participants" ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                      <circle cx="8.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
                      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
                      <circle cx="15.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
                    </svg>
                  )}
                </div>
                <div className="drawer-title-info">
                  <h3>{activeDrawer === "participants" ? "Team" : "Room Chat"}</h3>
                  <span className={`status-pill ${activeDrawer === "chat" ? (connectionStatus === "connected" ? "online" : "offline") : "idle"}`}>
                    {activeDrawer === "participants" ? `${room?.members?.length || 1} online` : (connectionStatus === "connected" ? "Live" : "Offline")}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setActiveDrawer(null)}
                aria-label="Close"
                title="Close (Esc)"
              >
                ✕
              </button>
            </div>

            <div className="drawer-body">
              {activeDrawer === "participants" ? (
                <Participants
                  actionUserId={actionUserId}
                  currentUserId={currentUserId}
                  isOwner={isOwner}
                  members={room?.members || []}
                  onChangeRole={handleRoleChange}
                  onRemoveUser={handleRemoveUser}
                  onTransferOwnership={handleTransferOwnership}
                />
              ) : (
                <Chat
                  currentUserId={currentUserId}
                  input={chatInput}
                  isConnected={connectionStatus === "connected"}
                  messages={messages}
                  onInputChange={setChatInput}
                  onSend={handleSendMessage}
                />
              )}
            </div>
          </aside>
        </div>
      ) : null}

      {error ? <div className="editor-toast">{error}</div> : null}
    </div>
  );
};

export default Editor;
