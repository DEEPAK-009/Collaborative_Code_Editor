import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import Logo from "../components/Logo";
import "../styles/home.css";

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-root">
      {/* Background Decorative Glows & Mesh */}
      <div className="bg-glow bg-glow--top" />
      <div className="bg-glow bg-glow--middle" />
      <div className="bg-glow bg-glow--bottom" />
      <div className="bg-grid-mesh" />

      {/* Navigation Bar */}
      <header className="site-nav">
        <div className="nav-container">
          <Link to="/" className="brand-badge">
            <Logo size={38} />
          </Link>

          <nav className="nav-menu">
            <a href="#features" className="nav-menu-link">Features</a>
            <a href="#languages" className="nav-menu-link">Runtimes</a>
            <a href="#workflow" className="nav-menu-link">How it Works</a>
            <a href="#use-cases" className="nav-menu-link">Use Cases</a>
          </nav>

          <div className="nav-auth-actions">
            {user ? (
              <div className="auth-user-preview">
                <span className="user-greeting">
                  Hi, <strong>{user.displayName || user.email?.split("@")[0] || "Developer"}</strong>
                </span>
                <Link to="/dashboard" className="btn-glow-primary">
                  <span>Open Workspace</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login" className="nav-login-btn">
                  Sign In
                </Link>
                <Link to="/register" className="btn-glow-primary">
                  <span>Get Started Free</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-content">
          <div className="hero-announcement-pill">
            <span className="pill-pulse" />
            <span className="pill-text">⚡ Realtime Multi-User Cloud IDE & Isolated Docker Runner</span>
          </div>

          <h1 className="hero-heading">
            Code Together in Real Time. <br />
            <span className="text-gradient">Execute at the Speed of Thought.</span>
          </h1>

          <p className="hero-description">
            CollabX gives developers, engineering teams, interviewers, and study groups a unified collaborative workspace.
            Experience sub-millisecond multi-cursor editing, sandboxed Docker compilation for 6+ languages, in-room team chat, and role-based permissions.
          </p>

          <div className="hero-cta-group">
            <Link to={user ? "/dashboard" : "/register"} className="btn-cta-large btn-cta-primary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              <span>{user ? "Launch Dashboard" : "Start Coding Free"}</span>
            </Link>
            <a href="#features" className="btn-cta-large btn-cta-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>Explore Features</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="hero-metrics-bar">
            <div className="metric-item">
              <span className="metric-val">&lt; 15ms</span>
              <span className="metric-lbl">Socket Sync Latency</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">6+ Runtimes</span>
              <span className="metric-lbl">Docker Sandboxed</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">100% Isolated</span>
              <span className="metric-lbl">Memory & CPU Quotas</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">Role-Based</span>
              <span className="metric-lbl">Owner / Editor / Viewer</span>
            </div>
          </div>
        </div>

        {/* Visual Workspace Hero Preview Card (Clean, Non-Interactive Visual IDE Mockup) */}
        <div className="workspace-hero-showcase">
          <div className="mockup-window-frame">
            {/* Top Chrome */}
            <div className="mockup-window-header">
              <div className="window-traffic-lights">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>

              <div className="mockup-room-chip">
                <span className="room-status-indicator" />
                <span className="room-label">Workspace:</span>
                <span className="room-id-value">ROOM-SYNC-7749</span>
              </div>

              <div className="mockup-presence-avatars">
                <div className="avatar-chip avatar-blue" title="Deepak (Owner)">
                  <span>D</span>
                </div>
                <div className="avatar-chip avatar-purple" title="Sarah (Editor)">
                  <span>S</span>
                </div>
                <div className="avatar-chip avatar-green" title="Alex (Viewer)">
                  <span>A</span>
                </div>
                <span className="user-count-badge">3 Active</span>
              </div>
            </div>

            {/* Subheader bar with tab and status */}
            <div className="mockup-tab-bar">
              <div className="mockup-tab active">
                <span>🐍</span>
                <span>solution.py</span>
              </div>
              <div className="mockup-tab">
                <span>⚡</span>
                <span>server.js</span>
              </div>
              <div className="mockup-tab">
                <span>⚙️</span>
                <span>main.cpp</span>
              </div>
              <div className="mockup-status-right">
                <span className="badge-docker-status">🐳 Docker Sandbox Ready</span>
                <span className="badge-role-owner">Role: Owner</span>
              </div>
            </div>

            {/* Split layout: Code Editor + Output Panel */}
            <div className="mockup-editor-split">
              {/* Code pane */}
              <div className="mockup-code-pane">
                <div className="mockup-gutter">
                  <span>1</span>
                  <span>2</span>
                  <span>3</span>
                  <span>4</span>
                  <span>5</span>
                  <span>6</span>
                  <span>7</span>
                  <span>8</span>
                  <span>9</span>
                  <span>10</span>
                </div>
                <div className="mockup-code-content">
                  <pre>
                    <code>{`async def synchronize_room(room_id: str, collaborators: list):
    """Realtime multi-cursor operational sync via Socket.IO"""
    print(f"🚀 Initializing isolated Docker session for {room_id}")
    
    # Broadcast state mutation to active peer sockets
    await broadcast_payload({
        "event": "CODE_UPDATE",
        "author": "Deepak (Owner)",
        "peers": len(collaborators)
    })
    return {"status": "HEALTHY", "latency_ms": 11.8}`}</code>
                  </pre>

                  {/* Visual simulated collaborative cursor tags */}
                  <div className="simulated-cursor cursor-deepak" style={{ top: "62px", left: "260px" }}>
                    <span className="cursor-caret" />
                    <span className="cursor-tag">Deepak (Owner)</span>
                  </div>
                  <div className="simulated-cursor cursor-sarah" style={{ top: "140px", left: "180px" }}>
                    <span className="cursor-caret" />
                    <span className="cursor-tag">Sarah (Editor)</span>
                  </div>
                </div>
              </div>

              {/* Terminal Output & Live Presence Pane */}
              <div className="mockup-side-pane">
                <div className="mockup-terminal-header">
                  <span>🐳 Docker Output</span>
                  <span className="term-badge-success">Exit 0 • 0.042s</span>
                </div>
                <div className="mockup-terminal-body">
                  <p className="term-line-dim">$ docker run --rm --memory=256m --cpus=0.5 python:3.11</p>
                  <p className="term-line-info">🚀 Initializing isolated Docker session for ROOM-SYNC-7749</p>
                  <p className="term-line-success">✓ Broadcast synced across 3 connected clients.</p>
                  <p className="term-line-success">✓ State: {'{"status": "HEALTHY", "latency_ms": 11.8}'}</p>
                </div>

                <div className="mockup-chat-preview">
                  <div className="mockup-chat-header">
                    <span>💬 In-Room Chat</span>
                    <span className="chat-badge">Live</span>
                  </div>
                  <div className="mockup-chat-msg">
                    <strong style={{ color: "#c084fc" }}>Sarah:</strong>
                    <span>Just updated the broadcast payload! 🚀</span>
                  </div>
                  <div className="mockup-chat-msg">
                    <strong style={{ color: "#60a5fa" }}>Deepak:</strong>
                    <span>Running the Docker test suite now...</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Status Ribbon */}
            <div className="mockup-footer-ribbon">
              <div className="ribbon-left">
                <span className="ribbon-item">
                  <span className="indicator-live-pulse" /> Socket.IO Connected (12ms)
                </span>
                <span className="ribbon-item">Python 3.11</span>
                <span className="ribbon-item">UTF-8</span>
              </div>
              <div className="ribbon-right">
                <span className="ribbon-item">Memory Quota: 256MB</span>
                <span className="ribbon-item">Access: Full Control</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bento Grid Feature Showcase */}
      <section id="features" className="features-bento-section">
        <div className="section-header-center">
          <span className="section-badge">Everything You Need</span>
          <h2 className="section-title">Built for Serious Collaborative Engineering</h2>
          <p className="section-subtitle">
            From lightning-fast cursor synchronization to safe containerized code execution, CollabX brings the entire developer cycle into a single browser tab.
          </p>
        </div>

        <div className="bento-grid-container">
          {/* Bento Card 1 - Realtime Synchronization */}
          <div className="bento-card bento-card--large bento-glow-cyan">
            <div className="bento-card-badge">⚡ Sub-millisecond</div>
            <div className="bento-icon-box cyan-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            </div>
            <h3>Realtime Operational Synchronization</h3>
            <p>
              Collaborative coding with zero lag. Multi-user cursor tracking, active selection highlights, and simultaneous text edits stay synchronized over robust WebSocket connections.
            </p>
            <div className="bento-visual-preview cursor-sync-preview">
              <div className="sync-pill-tag tag-blue">Deepak: Ln 24, Col 12</div>
              <div className="sync-pill-tag tag-purple">Sarah: Ln 38, Col 5</div>
              <div className="sync-pill-tag tag-emerald">Alex: Ln 12, Col 80</div>
            </div>
          </div>

          {/* Bento Card 2 - Docker Sandbox Execution */}
          <div className="bento-card bento-card--large bento-glow-emerald">
            <div className="bento-card-badge">🐳 100% Isolated</div>
            <div className="bento-icon-box emerald-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
            </div>
            <h3>Sandboxed Docker Code Execution</h3>
            <p>
              Compile and run Python, JavaScript, C++, Go, Rust, and Java securely in ephemeral Docker containers with strict CPU, RAM, and time quotas.
            </p>
            <div className="bento-visual-preview docker-chips-preview">
              <span className="docker-badge">🐍 Python 3.11</span>
              <span className="docker-badge">⚡ Node.js 20</span>
              <span className="docker-badge">⚙️ C++ 17 GCC</span>
              <span className="docker-badge">🐹 Go 1.22</span>
              <span className="docker-badge">🦀 Rust 1.77</span>
              <span className="docker-badge">☕ Java 21</span>
            </div>
          </div>

          {/* Bento Card 3 - Role-Based Governance */}
          <div className="bento-card bento-glow-purple">
            <div className="bento-icon-box purple-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3>Granular Role Governance</h3>
            <p>
              Assign <strong>Owner</strong>, <strong>Editor</strong>, or <strong>Viewer</strong> privileges. Prevent unwanted code tampering during live tech interviews or university lectures.
            </p>
          </div>

          {/* Bento Card 4 - In-Room Live Chat */}
          <div className="bento-card bento-glow-blue">
            <div className="bento-icon-box blue-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h3>Built-In Developer Chat</h3>
            <p>
              Discuss logic, share test cases, and coordinate changes right inside the room without switching between Discord, Slack, or Zoom.
            </p>
          </div>

          {/* Bento Card 5 - Monaco Editor Core */}
          <div className="bento-card bento-glow-amber">
            <div className="bento-icon-box amber-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </div>
            <h3>Monaco Editor Superpowers</h3>
            <p>
              Enjoy the familiar VS Code engine with rich syntax highlighting, auto-closing brackets, code folding, and multi-line cursor editing.
            </p>
          </div>

          {/* Bento Card 6 - Instant Room Sharing */}
          <div className="bento-card bento-glow-pink">
            <div className="bento-icon-box pink-bg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <h3>1-Click Room Sharing</h3>
            <p>
              Create unique shareable room codes in seconds. Teammates can jump in directly with an invitation link from any modern browser.
            </p>
          </div>
        </div>
      </section>

      {/* Multi-Language Runtimes Matrix */}
      <section id="languages" className="languages-matrix-section">
        <div className="section-header-center">
          <span className="section-badge">Docker Container Engines</span>
          <h2 className="section-title">6+ First-Class Polyglot Runtimes</h2>
          <p className="section-subtitle">
            Every code execution runs in an isolated Linux container preloaded with modern toolchains and security sandboxing.
          </p>
        </div>

        <div className="matrix-grid">
          <div className="matrix-card">
            <div className="matrix-top">
              <span className="matrix-icon">🐍</span>
              <span className="matrix-tag">Python 3.11</span>
            </div>
            <h4>Python Engine</h4>
            <p>Fast execution for algorithms, data manipulation, math scripts, and interview challenges.</p>
            <div className="matrix-specs">
              <span>• Isolated runtime</span>
              <span>• Standard library</span>
            </div>
          </div>

          <div className="matrix-card">
            <div className="matrix-top">
              <span className="matrix-icon">⚡</span>
              <span className="matrix-tag">Node.js 20 LTS</span>
            </div>
            <h4>JavaScript Engine</h4>
            <p>Full V8 engine support for ES Modules, asynchronous routines, and algorithmic tasks.</p>
            <div className="matrix-specs">
              <span>• Async / Await</span>
              <span>• Modern ES2023</span>
            </div>
          </div>

          <div className="matrix-card">
            <div className="matrix-top">
              <span className="matrix-icon">⚙️</span>
              <span className="matrix-tag">GCC 12 (C++17)</span>
            </div>
            <h4>C++ Engine</h4>
            <p>Optimized with -O3 compilation flags for ultra-fast competitive programming and data structures.</p>
            <div className="matrix-specs">
              <span>• Full STL suite</span>
              <span>• High performance</span>
            </div>
          </div>

          <div className="matrix-card">
            <div className="matrix-top">
              <span className="matrix-icon">🐹</span>
              <span className="matrix-tag">Go 1.22</span>
            </div>
            <h4>Go Engine</h4>
            <p>Built for concurrent routines, lightweight channels, and microservice algorithmic logic.</p>
            <div className="matrix-specs">
              <span>• Goroutine support</span>
              <span>• Native compiler</span>
            </div>
          </div>

          <div className="matrix-card">
            <div className="matrix-top">
              <span className="matrix-icon">🦀</span>
              <span className="matrix-tag">Rust 1.77</span>
            </div>
            <h4>Rust Engine</h4>
            <p>Safe systems-level code compilation with zero-cost abstractions and borrow checker guarantees.</p>
            <div className="matrix-specs">
              <span>• rustc + cargo</span>
              <span>• Strict memory safety</span>
            </div>
          </div>

          <div className="matrix-card">
            <div className="matrix-top">
              <span className="matrix-icon">☕</span>
              <span className="matrix-tag">OpenJDK 21 LTS</span>
            </div>
            <h4>Java Engine</h4>
            <p>Modern JVM with Virtual Threads, Pattern Matching, and standard collections for enterprise workflows.</p>
            <div className="matrix-specs">
              <span>• Java 21 LTS</span>
              <span>• JVM Sandbox</span>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Workflow */}
      <section id="workflow" className="workflow-section">
        <div className="section-header-center">
          <span className="section-badge">Fast & Seamless</span>
          <h2 className="section-title">Start Collaborating in 3 Simple Steps</h2>
        </div>

        <div className="workflow-steps-grid">
          <div className="workflow-step-card">
            <div className="step-number">01</div>
            <h3>Create or Join a Room</h3>
            <p>
              Generate a secure room code or enter an existing one to step into a shared code workspace immediately.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-number">02</div>
            <h3>Invite Team & Manage Roles</h3>
            <p>
              Share your room ID with teammates. Set permissions as Owner, Editor, or Viewer to maintain full room control.
            </p>
          </div>

          <div className="workflow-step-card">
            <div className="step-number">03</div>
            <h3>Pair Program, Chat & Execute</h3>
            <p>
              Type together with live multi-cursor tracking, discuss in room chat, and run your code with instant terminal output.
            </p>
          </div>
        </div>
      </section>

      {/* Real-World Use Cases */}
      <section id="use-cases" className="use-cases-section">
        <div className="section-header-center">
          <span className="section-badge">Built For Everyone</span>
          <h2 className="section-title">Tailored for Every Developer Scenario</h2>
        </div>

        <div className="use-cases-grid">
          <div className="use-case-card">
            <div className="use-case-icon">💼</div>
            <h3>Technical Interviews</h3>
            <p>Conduct real-time live coding interviews with sandboxed execution, syntax highlighting, and zero lag.</p>
          </div>

          <div className="use-case-card">
            <div className="use-case-icon">🎓</div>
            <h3>Classrooms & Bootcamps</h3>
            <p>Educators can broadcast code live, assign Viewer roles to students, and test assignments collaboratively.</p>
          </div>

          <div className="use-case-card">
            <div className="use-case-icon">🚀</div>
            <h3>Hackathons & Pair Debugging</h3>
            <p>Speed up sprint deliveries by debugging tricky edge cases and testing functions with peers simultaneously.</p>
          </div>

          <div className="use-case-card">
            <div className="use-case-icon">🏆</div>
            <h3>Competitive Programming</h3>
            <p>Practice LeetCode and Codeforces problems together, analyze time complexity, and compare benchmarks.</p>
          </div>
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="cta-banner-section">
        <div className="cta-banner-card">
          <div className="cta-glow-orb" />
          <div className="cta-content">
            <span className="cta-mini-pill">🚀 Ready to level up your pair programming?</span>
            <h2>Experience Realtime Collaborative Coding Today</h2>
            <p>
              Join CollabX for free. Create shared workspaces, invite peers, chat live, and execute code instantly.
            </p>
            <div className="cta-buttons-wrapper">
              <Link to={user ? "/dashboard" : "/register"} className="btn-cta-large btn-cta-primary">
                <span>{user ? "Go to My Dashboard" : "Create Free Account"}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              {!user && (
                <Link to="/login" className="btn-cta-large btn-cta-secondary">
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="brand-badge">
              <Logo size={36} />
            </Link>
            <p className="footer-bio">
              High-performance collaborative coding environment with live multi-cursor synchronization, Docker runtime isolation, and room governance.
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#languages">Supported Runtimes</a>
              <a href="#workflow">Workflow</a>
              <a href="#use-cases">Use Cases</a>
            </div>
            <div className="footer-col">
              <h4>Workspace</h4>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
            </div>
            <div className="footer-col">
              <h4>Tech Stack</h4>
              <span>Socket.IO Engine</span>
              <span>Docker Linux Sandbox</span>
              <span>Monaco Editor Core</span>
              <span>React 19 & Vite</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CollabX. Built for modern developer collaboration.</p>
          <div className="footer-pills">
            <span className="tech-badge">⚡ WebSocket Powered</span>
            <span className="tech-badge">🐳 Container Isolated</span>
            <span className="tech-badge">🛡️ Role Protected</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
