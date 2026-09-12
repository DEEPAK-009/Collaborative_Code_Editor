import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import Logo from "../components/Logo";

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      login(token);
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [login, navigate]);

  return (
    <div className="auth-page-wrapper">
      <div className="auth-bg-grid" />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          zIndex: 1,
        }}
      >
        <Logo size={42} textColor="#ffffff" accentColor="#38bdf8" />
        <div style={{ color: "#94a3b8", fontSize: "0.95rem", fontWeight: 500 }}>
          Completing authentication...
        </div>
      </div>
    </div>
  );
};

export default OAuthSuccess;

