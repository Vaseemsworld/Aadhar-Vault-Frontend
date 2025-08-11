import React, { useEffect, useMemo, useState } from "react";
import styles from "../styles/AssignOrders.module.css";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { BsFingerprint } from "react-icons/bs";
import { toast } from "react-toastify";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useMainContext } from "../context/MainContext";
import api from "../utils/api";

const columnConfig = {
  "Mobile Update": [
    { key: "operator_username", label: "Operator" },
    { key: "orderType", label: "Type" },
    { key: "fullName", label: "Name" },
    { key: "mobileNumber", label: "Mobile No." },
    { key: "email", label: "Email" },
    { key: "aadhaarNumber", label: "Aadhaar No." },
  ],
  Demographics: [
    { key: "operator_username", label: "Operator" },
    { key: "orderType", label: "Type" },
    { key: "fullName", label: "Name" },
    { key: "dateOfBirth", label: "Date of Birth" },
    { key: "gender", label: "Gender" },
    { key: "mobileNumber", label: "Mobile No." },
    { key: "aadhaarNumber", label: "Aadhaar No." },
    // { key: "village", label: "Village/ग्राम" },
    // { key: "district", label: "District/ज़िला" },
    // { key: "state", label: "State/राज्य" },
    // { key: "document", label: "Document" },
    // { key: "purpose", label: "Purpose" },
  ],
  "Child Enrollment": [
    { key: "operator_username", label: "Operator" },
    { key: "orderType", label: "Type" },
    { key: "fullName", label: "Child Name" },
    { key: "dateOfBirth", label: "Date of Birth" },
    { key: "fatherAadhaarNumber", label: "Father Aadhaar" },
    { key: "mobileNumber", label: "Mobile No." },
  ],
  "Aadhaar Number": [
    { key: "operator_username", label: "Operator" },
    { key: "date", label: "Date" },
    { key: "appliedby", label: "Applied By" },
    { key: "enrollment", label: "Enrollment" },
  ],
  "Aadhaar PDF": [
    { key: "operator_username", label: "Operator" },
    { key: "orderType", label: "Type" },
    { key: "date", label: "Date" },
    { key: "enrollment", label: "Enroll/Aadhaar" },
    { key: "status", label: "Status" },
  ],
};

const highlightMatch = (text, query) => {
  if (!query || typeof text !== "string") return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i}>{part}</mark>
    ) : (
      part
    )
  );
};

const DynamicTable = ({
  data,
  columns,
  searchQuery,
  sortKey,
  sortOrder,
  onSort,
  onDeleteConfirm,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleConfirmDelete = async () => {
    onDeleteConfirm(selectedId);
    setShowDelete(false);
    setSelectedId(null);
  };
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return "#" + "00000".substring(0, 6 - c.length) + c;
  };
  return (
    <>
      {showDelete && (
        <div className={styles.warningBox}>
          <div className={styles.deleteContainer}>
            <p>Are you sure you want to delete this entry.?</p>
            <div className={styles.btns}>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setShowDelete(false);
                  setSelectedId(null);
                }}
              >
                Cancel
              </button>
              <button
                className={styles.deleteBtn}
                onClick={handleConfirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => onSort(col.key)}
                style={{ cursor: "pointer" }}
              >
                {col.label}{" "}
                {sortKey === col.key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
            ))}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, index) => (
              <tr key={row.id || index}>
                <td>{index + 1}</td>
                {columns.map((col) => {
                  if (col.key === "operator_username") {
                    const bgColor = stringToColor(row[col.key] || "");
                    return (
                      <td
                        key={col.key}
                        style={{
                          backgroundColor: bgColor,
                          color: "#fff",
                          fontSize: "1.02rem",
                          fontWeight: "600",
                        }}
                      >
                        {highlightMatch(row[col.key] || "-", searchQuery)}
                      </td>
                    );
                  }
                  return (
                    <td key={col.key}>
                      {highlightMatch(row[col.key] || "-", searchQuery)}
                    </td>
                  );
                })}
                <td>
                  <div className={styles.actions}>
                    <button
                      className={`${styles.actionBtn} ${styles.FaEdit}`}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.BsFingerprint}`}
                      title="Fingerprint"
                    >
                      <BsFingerprint />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.FaEye}`}
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.FaTrash}`}
                      title="delete"
                      onClick={() => {
                        setSelectedId(row.id);
                        setShowDelete(true);
                      }}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 2} className={styles.noData}>
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

const AssignOrders = () => {
  const { currentPath } = useMainContext();
  const [searchParams] = useSearchParams();
  const orderType = searchParams.get("type");
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [tableHeading, setTableHeading] = useState("");
  const typeLabelMap = {
    mobile: "Mobile Update",
    demographics: "Demographics",
    child: "Child Enrollment",
    aadharno: "Aadhaar Number",
    aadharpdf: "Aadhaar PDF",
  };
  useEffect(() => {
    const fetchOrders = async () => {
      const label = typeLabelMap[orderType?.toLowerCase()];
      if (!label) return;
      try {
        const res = await api.get(`orders/?type=${orderType}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      }
    };
    fetchOrders();
  }, [orderType, location.state]);
  // Clear state after loading once
  useEffect(() => {
    if (location.state?.scrollToNew) {
      navigate(location.pathname + location.search, { replace: true });
    }
  }, [location, navigate]);
  useEffect(() => {
    if (currentPath === "Assign") setTableHeading("Assign Orders");
    else if (currentPath === "Entry-complaint")
      setTableHeading("Entry Complaint");
  }, [currentPath]);
  const addOrder = (orderType) => {
    navigate(`/create-order?type=${orderType}`);
  };
  const filteredOrders = useMemo(() => {
    let result = [...orders];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((row) =>
        ["fullName", "mobileNumber", "aadhaarNumber"]
          .filter((key) => key in row)
          .some((key) => row[key]?.toLowerCase().includes(q))
      );
    }
    if (sortKey) {
      result.sort((a, b) => {
        const valA = (a[sortKey] || "").toLowerCase();
        const valB = (b[sortKey] || "").toLowerCase();
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      });
    }
    return result;
  }, [orders, searchQuery, sortKey, sortOrder]);
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };
  const handleDeleteOrder = async (orderId) => {
    try {
      await api.delete(`/orders/${orderId}/`);
      setOrders((prevOrders) => prevOrders.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Failed to delete order:", err);
      toast.error("Failed to delete order. Please try again.");
    }
  };
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{tableHeading}</h2>
      {tableHeading === "Assign Orders" && (
        <div className={styles.createBtn}>
          <button className={styles.btn} onClick={() => addOrder(orderType)}>
            <FaPlus className={styles.plusIcon} />
            Create New
          </button>
        </div>
      )}
      <div className={styles.searchRow}>
        <input
          type="text"
          placeholder="Search by name, mobile, Aadhaar..."
          className={styles.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className={styles.tableWrapper}>
        {currentPath === "Assign" && (
          <DynamicTable
            data={filteredOrders}
            columns={columnConfig[typeLabelMap[orderType?.toLowerCase()]] || []}
            searchQuery={searchQuery}
            sortKey={sortKey}
            sortOrder={sortOrder}
            onSort={handleSort}
            onDeleteConfirm={handleDeleteOrder}
          />
        )}
      </div>
    </div>
  );
};

export default AssignOrders;
