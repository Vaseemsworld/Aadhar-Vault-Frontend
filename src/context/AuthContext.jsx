import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on first load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await api.get("csrf/");
        const res = await api.get("user/");
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (username, password) => {
    try {
      await api.get("csrf/");
      const res = await api.post("login/", { username, password });
      setUser(username);
      navigate("/dashboard");
    } catch (err) {
      throw new Error("Login Failed");
    }
  };

  const register = async (userData) => {
    try {
      await api.get("csrf/");
      await api.post("register/", userData);
      navigate("login/");
    } catch (err) {
      throw new Error("Registration failed");
    }
  };

  const logout = async () => {
    try {
      await api.get("csrf/");
      await api.post("logout/");
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
