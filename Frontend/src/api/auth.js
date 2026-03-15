import API from "./axios";

export const signupUser = (data) => {
  return API.post("/auth/signup", data);
};

export const loginUser = (data) => {
  return API.post("/auth/login", data);
};

export const googleLogin = () => {
  window.location.href = "http://localhost:6050/api/auth/google";
};