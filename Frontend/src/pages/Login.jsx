import { useContext, useEffect, useState } from "react";
import { loginUser, googleLogin } from "../api/auth";
import { AuthContext } from "../context/auth-context";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import "../styles/auth.css";
import "../styles/auth.mobile.css";

const TEST_ACCOUNTS = [
  { email: "alice1@gmail.com", password: "123123" },
  { email: "alice2@gmail.com", password: "123123" },
];

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
      <div className="auth-bg-grid" />

      <div className="auth-shell">
        <header className="auth-top-nav">
          <Link to="/" className="auth-floating-brand">
            <Logo size={36} textColor="#ffffff" accentColor="#38bdf8" />
          </Link>
        </header>

        <div className="auth-main-card-wrapper">
          {/* Main Login Card - Centered in Page */}
          <div className="auth-card">
            <div className="auth-copy">
              <h2 className="auth-title">
                Log<span>in</span>
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="auth-field-group">
                <label className="auth-field-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  placeholder="developer@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="auth-input"
                />
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  className="auth-input"
                />
              </div>

              {error ? (
                <div className="auth-error">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{error}</span>
                </div>
              ) : null}

              <button
                type="submit"
                className="auth-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Connecting..." : "Initialize Session"}
              </button>
            </form>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button onClick={googleLogin} className="auth-btn-google" type="button">
              <svg className="auth-google-icon" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
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

          {/* Simple Test Accounts Sidebar - Positioned on the Right */}
          <aside className="auth-demo-sidebar">
            <div className="demo-accounts-card">
              <h3 className="demo-accounts-title">Test Accounts</h3>
              <p className="demo-accounts-sub">Click to autofill</p>
              <div className="demo-accounts-list">
                {TEST_ACCOUNTS.map((account) => {
                  const isSelected =
                    formData.email === account.email &&
                    formData.password === account.password;

                  return (
                    <button
                      key={account.email}
                      type="button"
                      className={`demo-account-btn ${isSelected ? "active" : ""}`}
                      onClick={() => {
                        setFormData({
                          email: account.email,
                          password: account.password,
                        });
                        setError("");
                      }}
                    >
                      <span className="demo-acc-email">{account.email}</span>
                      <span className="demo-acc-pwd">Password: {account.password}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Login;
