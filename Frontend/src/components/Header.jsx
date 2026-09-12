import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const LANGUAGE_OPTIONS = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "cpp", label: "C++" },
  { value: "java", label: "Java" },
  { value: "go", label: "Go" },
  { value: "rust", label: "Rust" },
];

const Header = ({
  activeDrawer,
  canEdit,
  executionEnabled,
  isRunning,
  language,
  onBackToDashboard,
  onRun,
  onToggleDrawer,
  roomId,
  setLanguage,
}) => {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const langDropdownRef = useRef(null);

  const currentLangLabel =
    LANGUAGE_OPTIONS.find((opt) => opt.value === language)?.label || language;

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target)
      ) {
        setIsLangOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectLanguage = (value) => {
    setLanguage(value);
    setIsLangOpen(false);
  };

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <header className="editor-header">
      {/* Left Section: Brand & Room Chip */}
      <div className="editor-header__section editor-header__section--left">
        <Link to="/" className="editor-brand-link" title="CollabX Home">
          <Logo size={32} textColor="#ffffff" />
        </Link>

        <div className="editor-header-divider" />

        <div
          className="workspace-chip"
          onClick={handleCopyRoomId}
          title="Click to copy Room ID"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleCopyRoomId()}
        >
          <h1 className="workspace-room-id">{roomId}</h1>
          <span className="workspace-chip__copy-icon" aria-hidden="true">
            {copied ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </span>
          {copied && <span className="workspace-copied-badge">Copied!</span>}
        </div>
      </div>

      {/* Center Section: Language Selector & Run Button */}
      <div className="editor-header__section editor-header__section--center">
        <div className="language-dropdown-wrapper" ref={langDropdownRef}>
          <button
            type="button"
            className={`language-select-btn ${isLangOpen ? "active" : ""}`}
            onClick={() => setIsLangOpen((open) => !open)}
            aria-haspopup="listbox"
            aria-expanded={isLangOpen}
            title="Select programming language"
          >
            <svg
              className="lang-code-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
            <span>{currentLangLabel}</span>
            <svg
              className={`language-chevron ${isLangOpen ? "open" : ""}`}
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {isLangOpen && (
            <ul
              className="language-dropdown-menu"
              role="listbox"
              aria-label="Programming Language Options"
            >
              {LANGUAGE_OPTIONS.map((opt) => {
                const isSelected = opt.value === language;
                return (
                  <li
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    className={`language-option-item ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectLanguage(opt.value)}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <svg
                        className="language-check-icon"
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {executionEnabled ? (
          <button
            type="button"
            className="run-btn"
            onClick={onRun}
            disabled={isRunning || !canEdit}
            title={canEdit ? "Execute Code" : "Read-only view"}
          >
            {isRunning ? (
              <>
                <span className="run-spinner" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <svg
                  className="run-icon"
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="#ffffff"
                  aria-hidden="true"
                >
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                <span>Run</span>
              </>
            )}
          </button>
        ) : (
          <span className="status-pill idle">Demo mode</span>
        )}
      </div>

      {/* Right Section: Drawers & Exit Button */}
      <div className="editor-header__section editor-header__section--right">
        {/* Participants / Team Drawer Button */}
        <button
          type="button"
          className={`header-drawer-btn ${activeDrawer === "participants" ? "active" : ""}`}
          onClick={() => onToggleDrawer && onToggleDrawer("participants")}
          aria-label="Toggle participants drawer"
          title="Team Participants"
        >
          <svg
            className="header-drawer-btn__icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="drawer-btn-label">Team</span>
        </button>

        {/* Conversation / Chat Drawer Button */}
        <button
          type="button"
          className={`header-drawer-btn header-drawer-btn--chat ${activeDrawer === "chat" ? "active" : ""}`}
          onClick={() => onToggleDrawer && onToggleDrawer("chat")}
          aria-label="Toggle chat drawer"
          title="Conversation / Chat"
        >
          <svg
            className="header-drawer-btn__icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            <circle cx="8.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="15.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
          </svg>
          <span className="drawer-btn-label">Chat</span>
        </button>

        <div className="editor-header-divider" />

        {/* Exit Button */}
        <button
          type="button"
          className="exit-button"
          onClick={onBackToDashboard}
          aria-label="Leave room and return to dashboard"
          title="Leave room and return to dashboard"
        >
          <span className="door-icon" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
