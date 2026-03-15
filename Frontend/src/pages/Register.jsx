import { useState, useContext } from "react";
import { signupUser, googleLogin } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await signupUser({
        email: formData.email,
        password: formData.password,
      });

      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-lg shadow-md w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

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

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Signup
          </button>
        </form>

        <button
          onClick={googleLogin}
          className="w-full mt-4 border p-2 rounded hover:bg-gray-100"
        >
          Signup with Google
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link className="text-blue-500" to="/login">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;