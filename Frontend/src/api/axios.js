import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:6050/api",
  withCredentials: true,
});

export default API;