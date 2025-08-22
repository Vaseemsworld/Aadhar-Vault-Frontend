import axios from "axios";

// Get CSRF token from cookies
export function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
}

// Automatically attach CSRF token to unsafe methods
export async function fetchCSRF() {
  const res = await axios.get(
    "https://aadhar-vault-backend.onrender.com/api/csrf/",
    {
      withCredentials: true,
    }
  );
  return res.data.csrfToken;
}

const api = axios.create({
  baseURL: "https://aadhar-vault-backend.onrender.com/api/",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const safeMethods = ["get", "head", "options", "trace"];
  if (!safeMethods.includes(config.method)) {
    const csrfToken = getCookie("csrftoken") || fetchCSRF();
    config.headers["X-CSRFToken"] = csrfToken;
  }

  return config;
});

export default api;
