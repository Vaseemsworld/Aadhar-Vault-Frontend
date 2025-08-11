import { use, useEffect, useRef, useState } from "react";
import styles from "../styles/Dashboard.module.css";
import { FaFacebookF, FaYoutube, FaInstagram, FaTwitter } from "react-icons/fa";
import avatar from "../assets/avatar.webp";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    totalAssign: 160,
    totalComplete: 110,
    totalPending: 35,
    totalReject: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDayName = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();

  const generateCalendar = (monthDate) => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const calendarDays = generateCalendar(currentMonth);

  const handlePrevMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const monthYear = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className={styles.dashboard}>
        {/* Statistics Cards */}
        <div className={styles.statsGrid}>
          <div
            className={styles.statCard}
            style={{ backgroundColor: "#17a2b8" }}
          >
            <div className={styles.statIcon}>
              <span>👥</span>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>TOTAL ASSIGN</div>
              <div className={styles.statNumber}>{stats.totalAssign}</div>
            </div>
            <div className={styles.moreInfo}>
              <span>More info</span>
              <span>→</span>
            </div>
          </div>

          <div
            className={styles.statCard}
            style={{ backgroundColor: "#28a745" }}
          >
            <div className={styles.statIcon}>
              <span>✅</span>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>TOTAL COMPLETE ASSIGN</div>
              <div className={styles.statNumber}>{stats.totalComplete}</div>
            </div>
            <div className={styles.moreInfo}>
              <span>More info</span>
              <span>→</span>
            </div>
          </div>

          <div
            className={styles.statCard}
            style={{ backgroundColor: "rgb(255,185,62)" }}
          >
            <div className={styles.statIcon}>
              <span>⏰</span>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>TOTAL PENDING ASSIGN</div>
              <div className={styles.statNumber}>{stats.totalPending}</div>
            </div>
            <div className={styles.moreInfo}>
              <span>More info</span>
              <span>→</span>
            </div>
          </div>

          <div
            className={styles.statCard}
            style={{ backgroundColor: "#dc3545" }}
          >
            <div className={styles.statIcon}>
              <span>❌</span>
            </div>
            <div className={styles.statInfo}>
              <div className={styles.statLabel}>TOTAL REJECT ASSIGN</div>
              <div className={styles.statNumber}>{stats.totalReject}</div>
            </div>
            <div className={styles.moreInfo}>
              <span>More info</span>
              <span>→</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          {/* Time Display */}
          <div className={styles.timeDisplay}>
            <div className={styles.timeCard}>
              <div className={styles.timeLabel}>IT'S CURRENTLY</div>
              <div className={styles.dayName}>{getDayName(currentTime)}</div>
              <div className={styles.dateDisplay}>
                {formatDate(currentTime)}
              </div>
              <div
                className={styles.timeDisplay}
                style={{ background: "rgba(0, 0, 0, 0.1)" }}
              >
                {formatTime(currentTime)}
              </div>
            </div>
          </div>

          {/* Profile Section */}
          <div className={styles.profileSection}>
            <div className={styles.profileCard}>
              <div className={styles.profileAvatar}>
                <img src={avatar} alt="Profile" />
              </div>
              <h3>Aadhar Vault</h3>
              <div className={styles.socialLinks}>
                <a
                  href="#"
                  className={styles.socialIcon}
                  style={{ backgroundColor: "#3b5998" }}
                >
                  <FaFacebookF />
                </a>
                <a
                  href="#"
                  className={styles.socialIcon}
                  style={{ backgroundColor: "#ff0000" }}
                >
                  <FaYoutube />
                </a>
                <a
                  href="#"
                  className={styles.socialIcon}
                  style={{
                    background:
                      "linear-gradient(45deg, #feda75, #d62976, #962fbf)",
                  }}
                >
                  <FaInstagram />
                </a>
                <a
                  href="#"
                  className={styles.socialIcon}
                  style={{ backgroundColor: "#1da1f2" }}
                >
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>

          {/* Calendar */}
          <div className={styles.calendarSection}>
            <div className={styles.calendarCard}>
              <div className={styles.calendarHeader}>
                <button className={styles.calendarNav}>‹</button>
                <h3>📅 Calendar</h3>
                <button className={styles.calendarNav}>›</button>
              </div>
              <div className={styles.calendarSubHeader}>
                <button className={styles.prevMonth} onClick={handlePrevMonth}>
                  ‹
                </button>
                <span className={styles.currentMonth}>{monthYear}</span>
                <button className={styles.nextMonth} onClick={handleNextMonth}>
                  ›
                </button>
              </div>
              <div className={styles.calendarGrid}>
                <div className={styles.dayHeaders}>
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className={styles.dayHeader}>
                      {day}
                    </div>
                  ))}
                </div>
                <div className={styles.daysGrid}>
                  {calendarDays.map((date, index) => {
                    const isToday =
                      date.toDateString() === today.toDateString();
                    const isCurrentMonth =
                      date.getMonth() === currentMonth.getMonth() &&
                      date.getFullYear() === currentMonth.getFullYear();

                    return (
                      <div
                        key={index}
                        className={`${styles.dayCell} ${
                          isToday ? styles.today : ""
                        } ${!isCurrentMonth ? styles.otherMonth : ""}`}
                      >
                        {date.getDate()}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
