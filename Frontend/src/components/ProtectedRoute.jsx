import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";

const ProtectedRoute = ({ children }) => {
  const { isAuthReady, token } = useContext(AuthContext);

  if (!isAuthReady) {
    return <div className="route-shell">Restoring session...</div>;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
