import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:6050/api",
  withCredentials: true,
});

export default axiosInstance;