import axios from "../utils/axios";

export const registerUser = (data) => {
  return axios.post("/auth/signup", data);
};

export const loginUser = (data) => {
  return axios.post("/auth/login", data);
};

export const googleLogin = () => {
  window.location.href = "http://localhost:6050/api/auth/google";
};