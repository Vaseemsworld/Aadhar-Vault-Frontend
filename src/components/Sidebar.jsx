import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "../styles/Sidebar.module.css";
import avatar from "../assets/avatar.webp";
import {
  FaAngleLeft,
  FaShoppingCart,
  FaMap,
  FaCloudDownloadAlt,
  FaRegCircle,
  FaUser,
} from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";
import { useMainContext } from "../context/MainContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isSidebarOpen } = useMainContext();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeType = searchParams.get("type");
  const [expanded, setExpanded] = useState(null);

  const toggle = (key) => {
    setExpanded((prev) => (prev === key ? null : key));
  };

  // Auto-expand based on current route
  useEffect(() => {
    const pathname = location.pathname;

    if (pathname.startsWith("/assign")) {
      setExpanded("assign");
    } else if (pathname.startsWith("/entry-complaint")) {
      setExpanded("complaint");
    } else if (pathname.startsWith("/drivers")) {
      setExpanded("drivers");
    } else {
      setExpanded(null);
    }
  }, [location.pathname]);

  return (
    <aside
      className={`${styles.mainSidebar} ${
        !isSidebarOpen ? styles.collapsed : ""
      }`}
    >
      <section className={styles.sidebar}>
        {/* User Panel */}
        <div className={styles.userPanel}>
          <div className={styles.image}>
            <img className={styles.avatar} src={avatar} alt="User" />
          </div>
          <span
            className={styles.username}
            onClick={() => navigate("/profile")}
          >
            Aadhar Vault
          </span>
        </div>

        <div className={styles.header}>MAIN NAVIGATION</div>

        <ul className={styles.menu}>
          <li>
            <NavLink to="/" className="">
              <span className={styles.icon}>
                <AiFillDashboard />
              </span>
              <span className={styles.label}>Dashboard</span>
              <span
                className={`${styles.leftIcon} ${styles.rotatable} ${
                  location.pathname === "/" ? styles.rotate : ""
                }`}
              >
                <FaAngleLeft />
              </span>
            </NavLink>
          </li>
          {user.is_staff && (
            <li>
              <NavLink to="/operators" className="">
                <span className={styles.icon}>
                  <FaUser />
                </span>
                <span className={styles.label}>Operators</span>
                <span
                  className={`${styles.leftIcon} ${styles.rotatable} ${
                    location.pathname === "/" ? styles.rotate : ""
                  }`}
                >
                  <FaAngleLeft />
                </span>
              </NavLink>
            </li>
          )}

          {/* Assign Entry */}
          <li className={styles.treeview}>
            <div className={styles.treeToggle} onClick={() => toggle("assign")}>
              <span className={styles.icon}>
                <FaShoppingCart />
              </span>
              <span className={styles.label}>Assign Entry</span>
              <span
                className={`${styles.leftIcon} ${styles.rotatable} ${
                  expanded === "assign" ? styles.rotate : ""
                }`}
              >
                <FaAngleLeft />
              </span>
            </div>
            <div
              className={`${styles.submenuWrapper} ${
                expanded === "assign" ? styles.open : ""
              }`}
            >
              <ul className={styles.submenu}>
                {[
                  ["mobile", "Mobile Update"],
                  ["child", "Child Enrollment"],
                  ["demographics", "Demographics"],
                  ["aadharno", "Aadhaar Number"],
                  ["aadharpdf", "Aadhaar PDF"],
                ].map(([type, label]) => (
                  <li key={type}>
                    <NavLink
                      to={`/assign?type=${type}`}
                      className={({ isActive }) =>
                        `${styles.link} ${
                          activeType === type ? styles.active : ""
                        }`
                      }
                    >
                      <FaRegCircle className={styles.circle} />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {/* Entry Complaint */}
          <li className={styles.treeview}>
            <div
              className={styles.treeToggle}
              onClick={() => toggle("complaint")}
            >
              <span className={styles.icon}>
                <FaMap />
              </span>
              <span className={styles.label}>Entry Complaint</span>
              <span
                className={`${styles.leftIcon} ${styles.rotatable} ${
                  expanded === "complaint" ? styles.rotate : ""
                }`}
              >
                <FaAngleLeft />
              </span>
            </div>
            <div
              className={`${styles.submenuWrapper} ${
                expanded === "complaint" ? styles.open : ""
              }`}
            >
              <ul className={styles.submenu}>
                {[
                  ["mobilecomplaint", "Mobile Complaint"],
                  ["childcomplaint", "Child Complaint"],
                  ["democomplaint", "Demo.. Complaint"],
                ].map(([type, label]) => (
                  <li key={type}>
                    <NavLink
                      to={`/entry-complaint?type=${type}`}
                      className={({ isActive }) =>
                        `${styles.link} ${
                          activeType === type ? styles.active : ""
                        }`
                      }
                    >
                      <FaRegCircle className={styles.circle} />
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </li>

          {/* Download Drivers */}
          <li className={styles.treeview}>
            <div
              className={styles.treeToggle}
              onClick={() => toggle("drivers")}
            >
              <span className={styles.icon}>
                <FaCloudDownloadAlt />
              </span>
              <span className={styles.label}>Download Drivers</span>
              <span
                className={`${styles.leftIcon} ${styles.rotatable} ${
                  expanded === "drivers" ? styles.rotate : ""
                }`}
              >
                <FaAngleLeft />
              </span>
            </div>
            <div
              className={`${styles.submenuWrapper} ${
                expanded === "drivers" ? styles.open : ""
              }`}
            >
              <ul className={styles.submenu}>
                <li>
                  <a
                    href="https://www.radiumbox.com/download/mantra-mfs-100-rd-service-driver-software-download-windows"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaRegCircle className={styles.circle} />
                    Mantra RD Service
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.radiumbox.com/download/mantra-mfs-100-driver-software-download-windows"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaRegCircle className={styles.circle} />
                    MFS 100 Driver
                  </a>
                </li>
                <li>
                  <a
                    href="https://download.mantratecapp.com/StaticDownload/MFS100ClientService_9.0.3.8.exe"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaRegCircle className={styles.circle} />
                    Client Service 9.0.3.8
                  </a>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </section>
    </aside>
  );
}
