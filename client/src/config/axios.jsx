import axios from "axios";

const RAW_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const BASE_URL = RAW_BASE.replace(/\/+$/,""); // remove trailing slashes

const instance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

instance.interceptors.request.use(cfg => {
  const token = localStorage.getItem("auth_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default instance;
