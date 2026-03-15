import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import OAuthSuccess from "./pages/OAuthSuccess";
// import Dashboard from "./pages/Dashboard";
// import Editor from "./pages/Editor";
// import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        {/* <Route path="/dashboard" element={
          <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>} />

        <Route path="/editor/:roomId" element={
          <ProtectedRoute>
          <Editor />
          </ProtectedRoute>} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;