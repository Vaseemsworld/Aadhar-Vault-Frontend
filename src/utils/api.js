import axios from "axios";

let csrfToken = "";

// Fetch CSRF token once at app startup
export async function initCSRF() {
  const res = await axios.get(
    "https://aadhar-vault-backend.onrender.com/api/csrf/",
    { withCredentials: true }
  );
  csrfToken = res.data.csrfToken;
}

// Axios instance
const api = axios.create({
  baseURL: "https://aadhar-vault-backend.onrender.com/api/",
  withCredentials: true,
});

// Attach CSRF token to unsafe methods
api.interceptors.request.use((config) => {
  const safeMethods = ["get", "head", "options", "trace"];
  if (!safeMethods.includes(config.method)) {
    if (!csrfToken) {
      throw new Error("CSRF token not initialized! Call initCSRF() first.");
    }
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

export default api;
