import { useState, useContext } from "react";
import { loginUser, googleLogin } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(formData);

      login(res.data.token);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Login
          </button>

        </form>

        <button
          onClick={googleLogin}
          className="w-full mt-4 border p-2 rounded hover:bg-gray-100"
        >
          Login with Google
        </button>

        <p className="text-center mt-4">
          No account?{" "}
          <Link className="text-blue-500" to="/register">
            Signup
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;