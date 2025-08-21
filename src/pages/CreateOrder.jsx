import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CreateOrder.module.css";
import { useLocation } from "react-router-dom";
import api from "../utils/api";
import { CaptureFinger } from "../utils/mfs100";

const CreateOrder = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orderType = queryParams.get("type");
  const MAX_FILE_SIZE_MB = 10;
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    //common fields
    nameInHindi: "",
    dateOfBirth: "",
    gender: "",
    aadhaarNumber: "",
    mobileNumber: "",
    //child enroll. specific
    fatherName: "",
    fathernameInHindi: "",
    fatherAadhaarNumber: "",
    //address fields
    village: "",
    post: "",
    landmark: "",
    district: "",
    state: "Select a state",
    pincode: "",
    //document fields
    document: null,
    birthCertificate: null,
    childPhoto: null,
    addressProof: null,
    //purpose
    purpose: "SELECT OPTION",
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fingerprints, setFingerprints] = useState({
    first: null,
    second: null,
    third: null,
    fourth: null,
  });
  const getTitle = () => {
    const titles = {
      mobile: "Mobile Update",
      child: "Child Enrollment",
      demographics: "Demographics",
      aadharno: "Aadhaar Number",
      aadharpdf: "Aadhaar PDF",
    };
    return titles[orderType] || "Create Order";
  };
  const getDocumentFields = () => {
    return orderType === "child"
      ? ["birthCertificate", "childPhoto", "addressProof"]
      : ["document"];
  };
  const fieldLabelMap = {
    birthCertificate: "Birth Certificate",
    childPhoto: "Child Photo (PDF Only)",
    addressProof: "Address Proof (Optional)",
    document: "Document",
  };
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (!files.length) return;
    const file = files[0];
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error(`File "${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      setFormErrors((prev) => ({
        ...prev,
        [name]: `File must be less than ${MAX_FILE_SIZE_MB}MB`,
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: file,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericOnlyFields = [
      "aadhaarNumber",
      "mobileNumber",
      "fatherAadhaarNumber",
      "pincode",
    ];
    if (numericOnlyFields.includes(name)) {
      const numericValue = value.replace(/\D/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };
  const handleFingerprintClick = async (finger) => {
    try {
      const res = new CaptureFinger(60, 5000);

      if (!res?.data?.BitmapData) {
        alert(res.data.ErrorDescription);
        return;
      }
      const { BitmapData, AnsiTemplate } = res.data;

      setFingerprints((prev) => ({
        ...prev,
        [finger]: { BitmapData, AnsiTemplate },
      }));
      console.log("fingerprints", fingerprints);
    } catch (err) {
      alert("Failed to capture.");
    }
  };
  const validateForm = () => {
    const errors = {};
    let requiredFields = [];
    if (orderType === "mobile") {
      requiredFields = ["fullName", "aadhaarNumber", "mobileNumber"];
    } else {
      requiredFields = [
        "fullName",
        "dateOfBirth",
        "gender",
        "mobileNumber",
        "village",
        "post",
        "district",
        "state",
        "pincode",
      ];
      if (orderType === "child") {
        requiredFields.push("fatherAadhaarNumber");
      } else {
        requiredFields.push("aadhaarNumber");
      }
    }
    for (const field of requiredFields) {
      const value = formData[field];
      if (
        !value ||
        (field === "state" && value === "Select a state") ||
        (field === "purpose" && value === "SELECT OPTION")
      ) {
        errors[field] = "This field is required";
      }
    }
    return errors;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setFormData(formData);
      alert("Please fill all required fields.");
      setIsSubmitting(false);
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("orderType", orderType);
      if (orderType === "mobile") {
        formDataToSend.append("fullName", formData.fullName || "");
        formDataToSend.append("fatherName", formData.fatherName || "");
        formDataToSend.append("aadhaarNumber", formData.aadhaarNumber || "");
        formDataToSend.append("mobileNumber", formData.mobileNumber || "");
      } else {
        formDataToSend.append("fullName", formData.fullName || "");

        formDataToSend.append("dateOfBirth", formData.dateOfBirth || "");
        formDataToSend.append("gender", formData.gender.toLowerCase() || "");

        formDataToSend.append("mobileNumber", formData.mobileNumber || "");
        formDataToSend.append("village", formData.village || "");
        formDataToSend.append("post", formData.post || "");
        formDataToSend.append("landmark", formData.landmark || "");
        formDataToSend.append("district", formData.district || "");
        formDataToSend.append("state", formData.state || "");
        formDataToSend.append("pincode", formData.pincode || "");
        if (orderType === "child") {
          formDataToSend.append("fatherName", formData.fatherName || "");

          formDataToSend.append(
            "fatherAadhaarNumber",
            formData.fatherAadhaarNumber || ""
          );
        } else {
          formDataToSend.append("aadhaarNumber", formData.aadhaarNumber || "");
        }
      }
      const fingerprintData = {};
      Object.keys(fingerprints).forEach((finger) => {
        if (fingerprints[finger]) {
          fingerprintData[finger] = fingerprints[finger];
        }
      });
      if (Object.keys(fingerprintData).length > 0) {
        formDataToSend.append("fingerprints", JSON.stringify(fingerprintData));
      }
      console.log("formdata", formDataToSend);
      console.log("fingerprintdata", fingerprintData);
      const response = await api.post("/orders/", formDataToSend);

      if (response.status === 400) {
        setFormErrors(response.data);
      } else {
        setFormErrors("Submission failed. Please try again later.");
      }

      toast.success("Order created successfully!");
      navigate(`/assign?type=${orderType}/`);
    } catch (error) {
      console.error("Error creating order:", error);
      if (error.response) {
        if (error.response.status === 400) {
          setFormErrors(error.response.data);
        } else {
          setFormErrors("Submission failed. Please try again later.");
        }
      } else {
        setFormErrors("Network error. Please try again.");
      }
      toast.error("An error occurred while creating the order.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>{getTitle().toUpperCase()}</h1>
      </div>
      <div className={styles.form}>
        {orderType === "mobile" ? (
          <>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  className={styles.input}
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Father's Name</label>
                <input
                  type="text"
                  name="fatherName"
                  placeholder="Father's Name"
                  className={styles.input}
                  value={formData.fatherName}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Aadhaar Number.</label>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                  name="aadhaarNumber"
                  placeholder="Aadhaar Number"
                  className={styles.input}
                  value={formData.aadhaarNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Mobile Number.</label>
                <input
                  type="tel"
                  pattern="\d*"
                  inputMode="numeric"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  className={styles.input}
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Id</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className={styles.input}
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Purpose</label>
                <select
                  name="purpose"
                  className={styles.select}
                  value={formData.purpose}
                  onChange={handleInputChange}
                >
                  <option value="Select option">Select Option</option>
                  <option value="Mobile Number Update">
                    Mobile Number Update
                  </option>
                  <option value="Email Id & Mobile Update">
                    Email Id & Mobile Update
                  </option>
                  <option value="Email Id Update">Email Id Update</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ color: "#ff6b35" }}>
                  Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Name in English"
                  className={styles.input}
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ color: "#ff6b35" }}>
                  हिंदी में नाम
                </label>
                <input
                  type="text"
                  name="nameInHindi"
                  placeholder="हिंदी में नाम"
                  className={styles.input}
                  value={formData.nameInHindi}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ color: "#ff6b35" }}>
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  className={styles.input}
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ color: "#ff6b35" }}>
                  Gender
                </label>
                <select
                  name="gender"
                  className={styles.select}
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option value="Select gender">Select gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>
              </div>
            </div>
            <div className={styles.formRow}>
              {orderType === "child" && (
                <>
                  <div className={styles.formGroup}>
                    <label
                      className={styles.label}
                      style={{ color: "#ff6b35" }}
                    >
                      Father's Name
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      placeholder="Father's Name"
                      className={styles.input}
                      value={formData.fatherName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label
                      className={styles.label}
                      style={{ color: "#ff6b35" }}
                    >
                      पिता का नाम
                    </label>
                    <input
                      type="text"
                      name="fathernameInHindi"
                      placeholder="पिता का नाम"
                      className={styles.input}
                      value={formData.fathernameInHindi}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label
                      className={styles.label}
                      style={{ color: "#ff6b35" }}
                    >
                      Father's Aadhaar Number
                    </label>
                    <input
                      type="text"
                      pattern="\d*"
                      inputMode="numeric"
                      name="fatherAadhaarNumber"
                      placeholder="Aadhaar Number"
                      className={styles.input}
                      value={formData.fatherAadhaarNumber}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              {orderType === "demographics" && (
                <div className={styles.formGroup}>
                  <label className={styles.label} style={{ color: "#ff6b35" }}>
                    Aadhaar Number
                  </label>
                  <input
                    type="text"
                    pattern="\d*"
                    inputMode="numeric"
                    name="aadhaarNumber"
                    placeholder="Aadhaar Number"
                    className={styles.input}
                    value={formData.aadhaarNumber}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ color: "#ff6b35" }}>
                  Mobile Number
                </label>
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="\d*"
                  name="mobileNumber"
                  placeholder="Mobile Number"
                  className={styles.input}
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ color: "red" }}>
                  Village/ग्राम
                </label>
                <input
                  type="text"
                  name="village"
                  placeholder="Village/ग्राम"
                  className={styles.input}
                  value={formData.village}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ color: "red" }}>
                  Post/पोस्ट
                </label>
                <input
                  type="text"
                  name="post"
                  placeholder="Post/पोस्ट"
                  className={styles.input}
                  value={formData.post}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ color: "red" }}>
                  Landmark/लैंडमार्क(optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  placeholder="Landmark/लैंडमार्क(optional)"
                  className={styles.input}
                  value={formData.landmark}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ color: "red" }}>
                  District/जिला
                </label>
                <input
                  type="text"
                  name="district"
                  placeholder="District/जिला"
                  className={styles.input}
                  value={formData.district}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ color: "red" }}>
                  State/राज्य
                </label>
                <select
                  name="state"
                  className={styles.select}
                  value={formData.state}
                  onChange={handleInputChange}
                >
                  <option value="Select a state">Select a state</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label} style={{ color: "red" }}>
                  Pin code
                </label>
                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  className={styles.input}
                  value={formData.pincode}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles.formRow}>
              {orderType === "demographics" && (
                <div className={styles.formGroup}>
                  <label className={styles.label} style={{ color: "red" }}>
                    Purpose
                  </label>
                  <select
                    name="purpose"
                    className={styles.select}
                    value={formData.purpose}
                    onChange={handleInputChange}
                  >
                    <option value="Select option">Select Option</option>
                    <option value="Name Correction">Name Correction</option>
                    <option value="Address Correction">
                      Address Correction
                    </option>
                    <option value="Gender Correction">Gender Correction</option>
                    <option value="DOB Correction">DOB Correction</option>
                  </select>
                </div>
              )}
              {getDocumentFields().map((fieldName, index) => (
                <div key={fieldName} className={styles.formGroup}>
                  <label className={styles.label} style={{ color: "blue" }}>
                    {fieldLabelMap[fieldName] || fieldName}
                  </label>
                  <div className={styles.fileInputWrapper}>
                    <input
                      type="file"
                      id={fieldName}
                      name={fieldName}
                      className={styles.fileInput}
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <label htmlFor={fieldName} className={styles.fileLabel}>
                      <span className={styles.browseButton}>Browse...</span>
                      <span className={styles.fileName}>
                        {formData[fieldName]?.name || "No file selected."}
                        {formData[fieldName]?.size &&
                          ` (${(formData[fieldName].size / 1024 / 1024).toFixed(
                            2
                          )} MB)`}
                      </span>
                    </label>
                  </div>
                  {formErrors[fieldName] && (
                    <div className={styles.error}>{formErrors[fieldName]}</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
        {/* Fingerprint section */}
        <div className={styles.fingerprintSection}>
          {["first", "second", "third", "fourth"].map((finger, i) => (
            <div key={finger} className={styles.fingerprintGroup}>
              <div
                className={`${styles.fingerprintBox} ${
                  fingerprints[finger] ? styles.active : ""
                }`}
                onClick={() => handleFingerprintClick(finger)}
              >
                {fingerprints[finger] ? (
                  <img
                    src={`data:image/bmp;base64,${fingerprints[finger].bitmap}`}
                    alt={`Finger ${i + 1}`}
                    className={styles.fingerprintPreview}
                  />
                ) : (
                  <div className={styles.checkmark}>✓</div>
                )}
              </div>
              <button
                type="button"
                className={styles.fingerprintButton}
                onClick={() => handleFingerprintClick(finger)}
              >
                Finger {i + 1}
              </button>
            </div>
          ))}
        </div>
        {/* Submit button */}
        <button
          type="button"
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit And Verify"}
        </button>
      </div>
    </div>
  );
};

export default CreateOrder;
