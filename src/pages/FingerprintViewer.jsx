import React, { useState, useEffect, use } from "react";
import styles from "../styles/FingerprintViewer.module.css";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowBigLeft,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AadhaarLoader from "./Loader";
import { useMainContext } from "../context/MainContext";
import api from "../utils/api";

function FingerprintViewer() {
  const { currentPath } = useMainContext();
  const { type, orderId } = useParams();
  const navigate = useNavigate();
  const [fingerprints, setFingerprints] = useState({});
  const [searchParams] = useSearchParams();
  const [index, setIndex] = useState(0);
  const [brightness, setBrightness] = useState(1);
  const [zoom, setZoom] = useState(0.8);
  const [loading, setLoading] = useState(true);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [name, setName] = useState("");

  const fingerKeys = Object.keys(fingerprints);
  const currentFinger = fingerKeys[index] || null;

  const maxImages = Math.min(fingerKeys.length, 4);
  const next = () =>
    setIndex((prev) => (prev < maxImages - 1 ? prev + 1 : prev));

  const prev = () => setIndex((prev) => (prev > 0 ? prev - 1 : prev));

  const BitmapData = fingerprints[currentFinger]?.BitmapData || null;

  useEffect(() => {
    const fetchFingerprints = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}/fingerprints/`);
        setFingerprints(data.data.fingerprints || {});
        setAadhaarNumber(data.data.aadhaarNumber || "");
        setName(data.data.fullName || "");
      } catch (err) {
        console.error("Error fetching fingerprints:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFingerprints();
  }, [orderId]);

  if (loading) {
    <AadhaarLoader />;
    return;
  }

  return (
    <div className={styles.container}>
      <div className={`${styles.navigateBack}`}>
        <button
          onClick={() => navigate(`/assign?type=${type}/`)}
          className={`${styles.arrowBtn} `}
        >
          <ArrowLeft size={28} />
        </button>
      </div>
      {/* Header */}
      <h1 className={styles.title}>{name}'s Finger Prints</h1>
      <h2 className={styles.subtitle}>{aadhaarNumber} Aadhar Number</h2>
      <hr className={styles.divider} />

      {/* Top Buttons */}
      <div className={styles.controls}>
        <button
          className={styles.backBtn}
          onClick={() => navigate(`/assign?type=${type}/`)}
        >
          Back To Dashboard
        </button>
        <button
          className={styles.increase}
          onClick={() => setBrightness((b) => b + 0.1)}
        >
          Increase Brightness
        </button>
        <button
          className={styles.decrease}
          onClick={() => setBrightness((b) => Math.max(0.5, b - 0.1))}
        >
          Decrease Brightness
        </button>
      </div>

      {/* Zoom Controls */}
      <div className={styles.zoomControls}>
        <button onClick={() => setZoom((z) => z + 0.2)}>
          <ZoomIn size={18} />
        </button>
        <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}>
          <ZoomOut size={18} />
        </button>
      </div>

      {/* Image Carousel */}
      <div className={styles.carousel}>
        <button onClick={prev} className={styles.arrowBtn}>
          <ChevronLeft size={28} />
        </button>

        {BitmapData ? (
          <div className={styles.fingerprint}>
            <img
              key={index}
              src={`data:image/png;base64,${fingerprints[currentFinger]?.BitmapData}`}
              alt={`${currentFinger} fingerprit`}
              style={{
                filter: `brightness(${brightness})`,
                transform: `scale(${zoom})`,
              }}
            />
          </div>
        ) : (
          <p>No image available</p>
        )}

        <button onClick={next} className={styles.arrowBtn}>
          <ChevronRight size={28} />
        </button>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setBrightness(1);
          setZoom(1);
        }}
        className={styles.resetBtn}
      >
        <RotateCcw size={18} className={styles.icon} /> Reset Zoom
      </button>
    </div>
  );
}

export default FingerprintViewer;
