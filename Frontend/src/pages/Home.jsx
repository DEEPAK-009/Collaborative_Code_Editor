import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import "../styles/home.css";

const Home = () => {
  const { token } = useContext(AuthContext);

  return (
    <div className="home-page">
      <header className="home-nav">
        <div className="home-brand">
          <span className="home-brand__mark">CE</span>
          <span>CodeSync</span>
        </div>

        <div className="home-nav__actions">
          <Link className="home-nav__link" to="/login">
            Login
          </Link>
          <Link className="home-nav__button" to={token ? "/dashboard" : "/register"}>
            {token ? "Open dashboard" : "Get started"}
          </Link>
        </div>
      </header>

      <main className="home-hero">
        <section className="home-hero__copy">
          <p className="home-kicker">Realtime collaborative code editor</p>
          <h1>Write together, chat live, and run code from the same room.</h1>
          <p className="home-subtitle">
            Built for small teams that need a clean shared workspace with roles,
            Docker execution, persistent room history, and live presence.
          </p>

          <div className="home-cta">
            <Link className="home-primary" to={token ? "/dashboard" : "/register"}>
              {token ? "Go to dashboard" : "Create account"}
            </Link>
            <Link className="home-secondary" to="/login">
              Sign in
            </Link>
          </div>
        </section>

        <section className="home-preview">
          <div className="home-preview__panel">
            <div className="home-preview__bar">
              <span />
              <span />
              <span />
            </div>

            <div className="home-preview__content">
              <div className="home-preview__editor">
                <div className="home-preview__line">const room = await createRoom();</div>
                <div className="home-preview__line">socket.emit("join-room", room);</div>
                <div className="home-preview__line">console.log("Live collaboration ready");</div>
              </div>

              <div className="home-preview__sidebar">
                <div className="home-preview__card">
                  <span>Participants</span>
                  <strong>3 active</strong>
                </div>
                <div className="home-preview__card">
                  <span>Chat</span>
                  <strong>Instant sync</strong>
                </div>
                <div className="home-preview__card">
                  <span>Runtime</span>
                  <strong>Docker sandbox</strong>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="home-features">
        <article>
          <h2>Rooms with ownership</h2>
          <p>Create rooms, invite teammates, control roles, and hand ownership over cleanly.</p>
        </article>
        <article>
          <h2>Realtime sync</h2>
          <p>Code changes, cursors, chat, and room presence stay in sync through Socket.IO.</p>
        </article>
        <article>
          <h2>Run code safely</h2>
          <p>Execute supported languages inside Docker with memory, CPU, and network limits.</p>
        </article>
      </section>
    </div>
  );
};

export default Home;
