import React from "react";
import styles from "../styles/Loader.module.css";

const AadhaarLoader = ({
  message = "Transferring data from AadharVault.store...",
}) => {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loaderContent}>
        {/* Aadhaar Logo with Animation */}
        <div className={styles.aadhaarLogo}>
          {/* Sun rays */}
          <div className={styles.sunRays}>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={styles.ray}
                style={{ transform: `rotate(${i * 30}deg)` }}
              ></div>
            ))}
          </div>

          {/* Fingerprint circles */}
          <div className={styles.fingerprint}>
            <div className={styles.circle1}></div>
            <div className={styles.circle2}></div>
            <div className={styles.circle3}></div>
            <div className={styles.circle4}></div>
          </div>

          {/* Aadhaar Text */}
          <div className={styles.aadhaarText}>AADHAAR</div>
        </div>

        {/* Loading Message */}
        <div className={styles.loadingMessage}>{message}</div>

        {/* Progress Bar */}
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
      </div>
    </div>
  );
};

export default AadhaarLoader;
