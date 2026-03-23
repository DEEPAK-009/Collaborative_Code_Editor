import API, { BACKEND_URL } from "./axios";

export const signupUser = (data) => {
  return API.post("/auth/signup", data).then((response) => response.data);
};

export const loginUser = (data) => {
  return API.post("/auth/login", data).then((response) => response.data);
};

export const getCurrentUser = () => {
  return API.get("/auth/me").then((response) => response.data);
};

export const updateProfile = (data) => {
  return API.patch("/auth/me", data).then((response) => response.data);
};

export const googleLogin = () => {
  window.location.href = `${BACKEND_URL}/api/auth/google`;
};
