import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { runCode } from "../api/execute";
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

const Editor = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { token, user } = useContext(AuthContext);

  const [room, setRoom] = useState(location.state?.initialRoom || null);
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [actionUserId, setActionUserId] = useState(null);
  const [remoteCursors, setRemoteCursors] = useState({});

  const hasJoinedRef = useRef(false);
  const codeSyncTimeoutRef = useRef(null);
  const latestCodeRef = useRef("");
  const latestLanguageRef = useRef("javascript");
  const canEditRef = useRef(false);

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

    const handleRoomState = ({ room: nextRoom, messages: nextMessages }) => {
      setConnectionStatus("connected");
      setError("");
      setRoom(nextRoom);
      setMessages(nextMessages);
      setCode(nextRoom.code || "");
      setLanguage(nextRoom.language || "javascript");
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
      if (
        updatedBy === currentUserId &&
        nextCode === latestCodeRef.current &&
        (!nextLanguage || nextLanguage === latestLanguageRef.current)
      ) {
        return;
      }

      setCode(nextCode);

      if (nextLanguage) {
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
      socket.off("cursor_update", handleCursorUpdate);
      socket.off("cursor-remove", handleCursorRemove);
      socket.off("removed-from-room", handleRemovedFromRoom);
      socket.off("room-closed", handleRoomClosed);
      socket.off("room-error", handleRoomError);
      socket.disconnect();
      hasJoinedRef.current = false;
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
    setCode(nextCode);
    scheduleCodeSync(nextCode);
  };

  const handleLanguageChange = (nextLanguage) => {
    setLanguage(nextLanguage);
    latestLanguageRef.current = nextLanguage;
    scheduleCodeSync(latestCodeRef.current, nextLanguage);
  };

  const handleRun = async () => {
    try {
      setIsRunning(true);
      const response = await runCode(roomId, language, code);
      setOutput(response.output);
    } catch (requestError) {
      setOutput(requestError.error || "Execution failed");
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
      <Header
        canEdit={canEdit}
        connectionStatus={connectionStatus}
        isRunning={isRunning}
        language={language}
        onBackToDashboard={handleLeaveRoom}
        onRun={handleRun}
        roomId={roomId}
        setLanguage={handleLanguageChange}
        userRole={currentMember?.role}
      />

      <main className="editor-layout">
        <section className="editor-workbench">
          <CodeEditor
            code={code}
            language={language}
            onChange={handleEditorChange}
            onCursorMove={handleCursorMove}
            readOnly={!canEdit}
            remoteCursors={activeCursors}
          />
          <Output isRunning={isRunning} output={output} />
        </section>

        <aside className="editor-sidebar">
          <Participants
            actionUserId={actionUserId}
            currentUserId={currentUserId}
            isOwner={isOwner}
            members={room?.members || []}
            onChangeRole={handleRoleChange}
            onRemoveUser={handleRemoveUser}
            onTransferOwnership={handleTransferOwnership}
          />
          <Chat
            currentUserId={currentUserId}
            input={chatInput}
            isConnected={connectionStatus === "connected"}
            messages={messages}
            onInputChange={setChatInput}
            onSend={handleSendMessage}
          />
        </aside>
      </main>

      {error ? <div className="editor-toast">{error}</div> : null}
    </div>
  );
};

export default Editor;
