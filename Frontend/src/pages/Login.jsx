
import { useContext, useEffect, useState } from "react";
import { loginUser, googleLogin } from "../api/auth";
import { AuthContext } from "../context/auth-context";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await loginUser(formData);
      login(response.token, response.user);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.error || "Unable to sign in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-copy">
          <p className="auth-eyebrow">Realtime development workspace</p>
          <h2 className="auth-title">
            Log<span>in</span>
          </h2>
          <p className="auth-subtitle">
            Authenticate once, then collaborate, chat, and run code inside the
            same room.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="email"
            placeholder="developer@email.com"
            onChange={handleChange}
            className="auth-input"
          />

          <input
            name="password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            className="auth-input"
          />

          {error ? <div className="auth-error">{error}</div> : null}

          <button type="submit" className="auth-btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Connecting..." : "Initialize Session"}
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button onClick={googleLogin} className="auth-btn-google">
          <svg className="auth-google-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="auth-footer">
          No account? 
          <Link className="auth-link" to="/register">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
