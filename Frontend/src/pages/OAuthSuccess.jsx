import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

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

  return <div className="route-shell">Completing Google sign-in...</div>;
};

export default OAuthSuccess;
