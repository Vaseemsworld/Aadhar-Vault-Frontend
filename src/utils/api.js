import axios from "axios";

let csrfToken = "";

// Fetch CSRF token once at app startup
export async function initCSRF() {
  try {
    const res = await axios.get(
      "https://aadhar-vault-backend.onrender.com/api/csrf/",
      {
        withCredentials: true,
      }
    );

    csrfToken = res.data.csrfToken;
    return csrfToken;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    throw error;
  }
}

// Axios instance
const api = axios.create({
  baseURL: "https://aadhar-vault-backend.onrender.com/api/",
  withCredentials: true,
});

// Attach CSRF token to unsafe methods
api.interceptors.request.use(async (config) => {
  const safeMethods = ["get", "head", "options", "trace"];
  if (!safeMethods.includes(config.method)) {
    if (!csrfToken) {
      await initCSRF();
    }
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
});

export async function fetchCSRF() {
  return await initCSRF();
}

export default api;
