import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-[400px]">

        <div className="flex justify-center mb-6">
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 rounded-l-lg ${
              !isLogin ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Sign Up
          </button>

          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 rounded-r-lg ${
              isLogin ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Login
          </button>
        </div>

        {isLogin ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};

export default AuthPage;