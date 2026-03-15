// import { useState, useContext } from "react";
// import { signupUser, googleLogin } from "../api/auth";
// import { AuthContext } from "../context/AuthContext";
// import { useNavigate, Link } from "react-router-dom";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (formData.password !== formData.confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }

//     try {
//       const res = await signupUser({
//         email: formData.email,
//         password: formData.password,
//       });

//       login(res.data.token);
//       navigate("/dashboard");
//     } catch (err) {
//       alert(err.response?.data?.error);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-gray-100">

//       <div className="bg-white p-8 rounded-lg shadow-md w-96">

//         <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">

//           <input
//             name="email"
//             placeholder="Email"
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />

//           <input
//             name="password"
//             type="password"
//             placeholder="Password"
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />

//           <input
//             name="confirmPassword"
//             type="password"
//             placeholder="Confirm Password"
//             onChange={handleChange}
//             className="border p-2 rounded"
//           />

//           <button
//             type="submit"
//             className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//           >
//             Signup
//           </button>
//         </form>

//         <button
//           onClick={googleLogin}
//           className="w-full mt-4 border p-2 rounded hover:bg-gray-100"
//         >
//           Signup with Google
//         </button>

//         <p className="text-center mt-4">
//           Already have an account?{" "}
//           <Link className="text-blue-500" to="/login">
//             Login
//           </Link>
//         </p>

//       </div>
//     </div>
//   );
// };

// export default Register;

import { useState, useContext } from "react";
import { signupUser, googleLogin } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";

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
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Sign<span>up</span></h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            name="email"
            placeholder="developer@email.com"
            onChange={handleChange}
            className="auth-input"
          />

          <input
            name="password"
            type="password"
            placeholder="Create Password"
            onChange={handleChange}
            className="auth-input"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            onChange={handleChange}
            className="auth-input"
          />

          <button type="submit" className="auth-btn-primary">
            Create Workspace
          </button>
        </form>

        <div className="auth-divider">
          <span>OR</span>
        </div>

        <button onClick={googleLogin} className="auth-btn-google">
           <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Signup with Google
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <Link className="auth-link" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;