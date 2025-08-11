import { useState } from "react";
import { Link } from "react-router-dom";

import styles from "../styles/Login.module.css";
import { useAuth } from "../context/AuthContext";
import AadhaarLoader from "../pages/Loader";

export default function Register() {
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    if (!form.username.trim() || !form.password || !form.confirm_password) {
      setError("Please fill in all fields");
      return false;
    }

    if (form.username.trim().length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      // Pass userData object as expected by AuthContext
      const userData = {
        username: form.username.trim(),
        password: form.password,
        confirm_password: form.confirm_password,
      };

      await register(userData);
    } catch (err) {
      // More specific error handling
      if (err.response?.data?.username) {
        setError("Username already exists");
      } else if (err.response?.data?.password) {
        setError("Password requirements not met");
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later.");
      } else {
        setError("Registration failed. Please try again.");
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
        <h2 className={styles.title}>Register</h2>

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

        <input
          className={styles.input}
          type="password"
          placeholder="Confirm Password"
          value={form.confirm_password}
          onChange={(e) =>
            handleInputChange("confirm_password", e.target.value)
          }
          disabled={isSubmitting}
          required
        />

        <button className={styles.button} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>

        {error && (
          <p className={styles.error} style={{ color: "red" }}>
            {error}
          </p>
        )}

        <p className={styles.switch}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
