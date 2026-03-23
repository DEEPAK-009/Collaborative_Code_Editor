import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
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
          <Link className="home-nav__button" to="/register">
            Signup
          </Link>
        </div>
      </header>

      <main className="home-hero">
        <section className="home-hero__copy">
          <p className="home-kicker">Realtime collaborative code editor</p>
          <h1>Write together, review live, and run code from one shared room.</h1>
          <p className="home-subtitle">
            CodeSync gives teams a single workspace for realtime editing, role-based
            collaboration, live chat, room ownership, and Docker-backed execution.
          </p>

          <div className="home-highlights">
            <span>Realtime rooms</span>
            <span>Socket chat</span>
            <span>Docker execution</span>
            <span>Owner controls</span>
          </div>
        </section>

        <section className="home-preview">
          <div className="home-preview__panel">
            <div className="home-preview__image" />
            <div className="home-preview__overlay">
              <div className="home-preview__stat">
                <span>Code sessions</span>
                <strong>Live collaboration for classrooms, teams, and interviews</strong>
              </div>
              <div className="home-preview__stat">
                <span>Execution</span>
                <strong>JavaScript, Python, C++, Java, Go, and Rust in Docker</strong>
              </div>
              <div className="home-preview__stat">
                <span>Room controls</span>
                <strong>Owners manage members, roles, and room ownership without friction</strong>
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
