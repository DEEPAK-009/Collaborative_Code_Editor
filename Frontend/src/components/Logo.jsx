const Logo = ({
  size = 36,
  showText = true,
  textColor = "inherit",
  accentColor = "#2563eb",
  className = "",
}) => {
  return (
    <div className={`collabx-logo-container ${className}`} style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
      <div
        className="collabx-logo-icon"
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          background: "linear-gradient(135deg, rgba(37, 99, 235, 0.12) 0%, rgba(14, 165, 233, 0.18) 100%)",
          borderRadius: Math.max(8, Math.round(size * 0.26)),
          border: "1px solid rgba(37, 99, 235, 0.28)",
          padding: Math.round(size * 0.12),
          boxShadow: "0 4px 14px rgba(37, 99, 235, 0.12)",
        }}
      >
        <svg
          viewBox="0 0 104 104"
          width="100%"
          height="100%"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bracketGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="xGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>

          {/* Left Bracket { */}
          <path
            d="M 37 20 C 27 20, 20 28, 20 40 C 20 48, 14 50, 9 52 C 14 54, 20 56, 20 64 C 20 76, 27 84, 37 84"
            stroke="url(#bracketGrad)"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Bracket } */}
          <path
            d="M 67 20 C 77 20, 84 28, 84 40 C 84 48, 90 50, 95 52 C 90 54, 84 56, 84 64 C 84 76, 77 84, 67 84"
            stroke="url(#bracketGrad)"
            strokeWidth="7.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Center X */}
          <path
            d="M 36 32 L 68 72"
            stroke="url(#xGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 68 32 L 56.5 46.5"
            stroke="url(#xGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 47.5 57.5 L 36 72"
            stroke="url(#xGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <span
          className="collabx-logo-text"
          style={{
            fontWeight: 800,
            fontSize: `${Math.max(16, Math.round(size * 0.54))}px`,
            color: textColor,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          Collab<span style={{ color: accentColor }}>X</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
