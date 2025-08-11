import { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import styles from "../styles/Layout.module.css";
import { FaHome, FaBars } from "react-icons/fa";
import avatar from "../assets/avatar.webp";
import { useMainContext } from "../context/MainContext";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { currentPath } = useMainContext();
  const [showDropdown, setShowDropdown] = useState(false);
  const { toggleSidebar, isSidebarOpen } = useMainContext();
  const header = user.is_staff ? "Operators" : "Dashboard";
  const [heading, setHeading] = useState(header);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (currentPath === "Assign") {
      setHeading("Assign Orders");
    } else if (currentPath === "Entry-complaint") {
      setHeading("Entry Complaint");
    } else if (currentPath === "Profile") {
      setHeading("Profile");
    }
  }, [currentPath]);

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    else if (hour < 17) return "Good Afternoon";
    else return "Good Evening";
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPath]);

  const toggleDropwdown = () => setShowDropdown((prev) => !prev);

  return (
    <>
      {/* header */}
      <header className={styles.mainHeader}>
        <a
          className={`${styles.logo} ${!isSidebarOpen ? styles.collapsed : ""}`}
          href="/"
        >
          <span className={styles.logoMini}>
            <img src="imges/slogo.png" alt="" />
          </span>
          <span className={styles.logoLong}>
            <img src="imges/slogo.png" alt="" />
          </span>
        </a>
        <nav className={styles.navbar}>
          <a
            className={styles.sidebarToggle}
            role="button"
            onClick={toggleSidebar}
          >
            <FaBars size={18} />
          </a>
          <div className={styles.navProfile}>
            <a
              className={styles.profile}
              role="button"
              onClick={toggleDropwdown}
            >
              <img className={styles.avatar} src={avatar} alt="image" />
              <span className={styles.username}>Aadhar Vault</span>
            </a>
            {showDropdown && (
              <div className={styles.dropdown} ref={dropdownRef}>
                <div className={styles.profileInfo}>
                  <img className={styles.avatar} src={avatar} alt="image" />
                  <div className={styles.username}>Aadhar Vault</div>
                </div>
                <div className={styles.buttons}>
                  <button
                    className={styles.button}
                    style={{ right: "10px" }}
                    onClick={() => navigate("/profile")}
                  >
                    Profile
                  </button>
                  <button
                    className={styles.button}
                    style={{ left: "10px" }}
                    onClick={() => logout()}
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      <div className={styles.main}>
        <Sidebar />
        {/* main */}
        <main className={styles.mainContent}>
          <div
            className={`${styles.contentWrapper} ${
              !isSidebarOpen && styles.sidebarClosed
            }`}
          >
            <div className={styles.dashboardHeader}>
              {/* <div className={styles.contentHeader}> */}
              {user.is_staff ? <h1>Operators</h1> : <h1>Dashboard</h1>}
              {/* <h1>{title}</h1> */}
              <span className={styles.subtitle}>
                Control Panel - {getGreeting()}
              </span>
            </div>
            <div className={styles.breadcrumb}>
              <FaHome className={styles.breadcrumbIcon} />
              <span className={styles.breadcrumbHome}>Home</span>
              <span className={styles.separator}>&gt;</span>
              <span className={styles.breadcrumbText}>{heading}</span>
            </div>
            <div className={styles.content}>
              <Outlet />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className={styles.footer}>
          <p>Copyright © 2024 Aadhar Vault</p>
          <p>
            Developed by{" "}
            <a
              href="https://wa.me/917073237376"
              target="_blank"
              rel="noopener noreferrer"
            >
              Vaseem Khan
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
