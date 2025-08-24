import React, { useEffect, useState } from "react";
import styles from "../styles/ProfileDashboard.module.css";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLocationArrow,
  FaHeart,
} from "react-icons/fa";
import api from "../utils/api";

const ProfileDashboard = () => {
  const [activeTab, setActiveTab] = useState("edit");
  const [profileData, setProfileData] = useState({
    name: "Aadhar Vault",
    phone: "8239228138",
    email: "srk@gmail.com",
    phone2: "",
    interest: "",
    education: "",
    address: "",
    notes: "",
    facebook: "",
    instagram: "",
    youtube: "",
    twitter: "",
  });

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateProfile = () => {
    // console.log("Profile updated:", profileData);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("user/");
        setProfileData((prev) => ({
          ...prev,
          name: res.data.username,
        }));
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
      //   finally {
      //     setProfileData((prev) => ({
      //       ...prev,
      //       name: username,
      //     }));
      // }
    };
    fetchProfile();
  }, []);

  return (
    <div className={styles.profileDashboard}>
      <div className={styles.profileContent}>
        {/* Left Column - Profile Card */}
        <div className={styles.profileCard}>
          <div className={styles.profileAvatar}>
            <div className={styles.avatarCircle}>
              <span className={styles.avatarText}>AV</span>
            </div>
          </div>

          <h2 className={styles.profileName}>Aadhar Vault</h2>

          <div className={styles.socialIcons}>
            <div className={`${styles.socialIcon} ${styles.facebook}`}>
              <FaFacebook />
            </div>
            <div className={`${styles.socialIcon} ${styles.youtube}`}>
              <FaYoutube />
            </div>
            <div className={`${styles.socialIcon} ${styles.instagram}`}>
              <FaInstagram />
            </div>
            <div className={`${styles.socialIcon} ${styles.twitter}`}>
              <FaTwitter />
            </div>
          </div>

          <div className={styles.aboutSection}>
            <h3>About Me</h3>
            <div className={styles.aboutItem}>
              <FaLocationArrow
                className={styles.icon}
                style={{ color: "#667eea " }}
              />
              <span>Location</span>
            </div>
            <div className={styles.aboutItem}>
              <FaHeart
                className={styles.icon}
                style={{ color: "#ea6666ff " }}
              />
              <span>Interest</span>
            </div>
          </div>
        </div>

        {/* Right Column - Profile Form */}
        <div className={styles.profileFormSection}>
          <div className={styles.tabHeader}>
            <button
              className={`${styles.tab} ${
                activeTab === "edit" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("edit")}
            >
              Edit Profile
            </button>
            <button
              className={`${styles.tab} ${
                activeTab === "password" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("password")}
            >
              Change Password
            </button>
          </div>

          {activeTab === "edit" && (
            <div className={styles.profileForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Phone</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone2</label>
                  <input
                    type="text"
                    placeholder="Business No."
                    value={profileData.phone2}
                    onChange={(e) =>
                      handleInputChange("phone2", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Interest</label>
                  <input
                    type="text"
                    placeholder="Interest"
                    value={profileData.interest}
                    onChange={(e) =>
                      handleInputChange("interest", e.target.value)
                    }
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Education</label>
                  <input
                    type="text"
                    placeholder="Education"
                    value={profileData.education}
                    onChange={(e) =>
                      handleInputChange("education", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Address</label>
                  <textarea
                    placeholder="Address"
                    value={profileData.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  ></textarea>
                </div>
                <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                  <label>Notes</label>
                  <textarea
                    placeholder="Notes"
                    value={profileData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  ></textarea>
                </div>
              </div>

              <div className={styles.socialFormSection}>
                <div className={styles.socialInputGroup}>
                  <div
                    className={`${styles.socialIconInput} ${styles.facebook}`}
                  >
                    <FaFacebook />
                  </div>
                  <input
                    type="text"
                    placeholder="Facebook"
                    value={profileData.facebook}
                    onChange={(e) =>
                      handleInputChange("facebook", e.target.value)
                    }
                  />
                </div>

                <div className={styles.socialInputGroup}>
                  <div
                    className={`${styles.socialIconInput} ${styles.youtube}`}
                  >
                    <FaYoutube />
                  </div>
                  <input
                    type="text"
                    placeholder="Youtube"
                    value={profileData.youtube}
                    onChange={(e) =>
                      handleInputChange("youtube", e.target.value)
                    }
                  />
                </div>

                <div className={styles.socialInputGroup}>
                  <div
                    className={`${styles.socialIconInput} ${styles.instagram}`}
                  >
                    <FaInstagram />
                  </div>
                  <input
                    type="text"
                    placeholder="Instagram"
                    value={profileData.instagram}
                    onChange={(e) =>
                      handleInputChange("instagram", e.target.value)
                    }
                  />
                </div>

                <div className={styles.socialInputGroup}>
                  <div
                    className={`${styles.socialIconInput} ${styles.twitter}`}
                  >
                    <FaTwitter />
                  </div>
                  <input
                    type="text"
                    placeholder="Twitter"
                    value={profileData.twitter}
                    onChange={(e) =>
                      handleInputChange("twitter", e.target.value)
                    }
                  />
                </div>
              </div>
              <button
                className={styles.updateBtn}
                onClick={handleUpdateProfile}
              >
                Update Profile
              </button>
            </div>
          )}

          {activeTab === "password" && (
            <div className={styles.passwordForm}>
              <div className={styles.formGroup}>
                <label>Current Password</label>
                <input type="password" />
              </div>
              <div className={styles.formGroup}>
                <label>New Password</label>
                <input type="password" />
              </div>
              <div className={styles.formGroup}>
                <label>Confirm New Password</label>
                <input type="password" />
              </div>
              <button className={styles.updateBtn}>Update Password</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboard;
