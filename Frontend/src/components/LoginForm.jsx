import { useState } from "react";
import { loginUser, googleLogin } from "../api/auth";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

      const token = res.data.token;

      localStorage.setItem("token", token);

      alert("Login successful");

      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2 className="text-center text-lg font-semibold mb-4">
        Log in to your existing profile
      </h2>

      <button
        onClick={googleLogin}
        className="w-full bg-gray-100 border py-2 rounded-md mb-4"
      >
        Continue with Google
      </button>

      <div className="text-center text-sm mb-4">OR</div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-2 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-2 rounded"
          onChange={handleChange}
          required
        />

        <button className="bg-blue-500 text-white py-2 rounded-md mt-2">
          LOGIN
        </button>
      </form>
    </div>
  );
};

export default LoginForm;