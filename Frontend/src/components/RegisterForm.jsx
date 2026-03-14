import { useState } from "react";
import { registerUser, googleLogin } from "../api/auth";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ check password match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await registerUser({
        email: formData.email,
        password: formData.password,
      });

      alert("Registration successful");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2 className="text-center text-lg font-semibold mb-4">
        Join CodeEditor to start coding
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

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          className="border p-2 rounded"
          onChange={handleChange}
          required
        />

        <button className="bg-blue-500 text-white py-2 rounded-md mt-2">
          REGISTER
        </button>

      </form>
    </div>
  );
};

export default RegisterForm;