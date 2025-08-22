import axios from "axios";

// Get CSRF token from cookies
export function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
}

const api = axios.create({
  baseURL: "https://aadhar-vault-backend.onrender.com/api/",
  withCredentials: true, // Important
});

// Automatically attach CSRF token to unsafe methods
api.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrftoken");

  const safeMethods = ["get", "head", "options", "trace"];
  if (!safeMethods.includes(config.method)) {
    config.headers["X-CSRFToken"] = csrfToken;
  }

  return config;
});

export default api;
