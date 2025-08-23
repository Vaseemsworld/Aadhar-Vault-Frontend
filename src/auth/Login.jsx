import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import styles from "../styles/Login.module.css";
import { useAuth } from "../context/AuthContext";
import AadhaarLoader from "../pages/Loader";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login, loading } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/dashboard";

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, from]);

  if (loading) return <AadhaarLoader />;
  if (user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.username.trim() || !form.password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      await login(form.username.trim(), form.password);
    } catch (err) {
      // More specific error handling
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.box}>
          <AadhaarLoader />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.box}>
        <h2 className={styles.title}>Login</h2>

        <input
          className={styles.input}
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => handleInputChange("username", e.target.value)}
          disabled={isSubmitting}
          required
        />

        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          disabled={isSubmitting}
          required
        />

        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p className={styles.error} style={{ color: "red" }}>
            {error}
          </p>
        )}

        <p className={styles.switch}>
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}
