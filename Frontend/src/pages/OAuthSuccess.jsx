import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
  }, []);

  return <div>Logging you in...</div>;
};

export default OAuthSuccess;