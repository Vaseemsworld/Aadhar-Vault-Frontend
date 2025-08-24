import { useEffect, useState } from "react";
import api from "../utils/api";
import { toast } from "react-toastify";
import AadhaarLoader from "./Loader";
import styles from "../styles/Operators.module.css";
import { FaPlus } from "react-icons/fa";

export default function Operators() {
  const [operators, setOperators] = useState([]);
  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [fetching, setFetching] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [createOp, setCreateOp] = useState(false);

  const fetchOperators = async () => {
    setFetching(true);
    try {
      const res = await api.get("/operators/");
      setOperators(res.data);
    } catch (err) {
      console.error("Error fetching operators:", err);
      toast.error("Failed to fetch operators");
    } finally {
      setFetching(false);
    }
  };

  const validateForm = () => {
    const formErrors = {};
    if (!form.username.trim()) {
      formErrors.username = "Username is required";
    } else if (form.username.length < 3) {
      formErrors.username = "Username must be at least 3 characters";
    }
    if (!form.password.trim()) {
      formErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      formErrors.password = "Password must be at least 6 characters";
    }
    return formErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddOperator = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setCreating(true);
    try {
      await api.post("/create-operator/", form);
      toast.success("Operator added successfully.");
      setForm({ username: "", password: "" });
      setCreateOp(false);
      fetchOperators();
    } catch (err) {
      console.error("Error creating operator:", err);
      toast.error("Failed to create operator");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteOperator = async () => {
    try {
      await api.delete(`/delete-operator/${selectedId}/`);
      setOperators((prev) => prev.filter((o) => o.id !== selectedId));
      toast.success("Operator deleted successfully.");
    } catch (err) {
      console.error("Failed to delete operator:", err);
      toast.error("Failed to delete operator");
    } finally {
      setShowDelete(false);
      setSelectedId(null);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, []);

  return (
    <>
      {fetching && <AadhaarLoader />}
      <div className={styles.container}>
        {!createOp ? (
          <>
            <div>
              <button
                className={styles.addBtn}
                onClick={() => setCreateOp(true)}
              >
                <FaPlus className={styles.plusIcon} />
                Add Operator
              </button>
            </div>

            <h2 className={styles.title}>Operators List</h2>

            {operators.length === 0 ? (
              <p className={styles.noData}>No operators found.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {operators.map((op, index) => (
                    <tr key={op.id}>
                      <td>{index + 1}</td>
                      <td>{op.username}</td>
                      <td>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => {
                            setSelectedId(op.id);
                            setShowDelete(true);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {showDelete && (
              <div className={styles.warningBox}>
                <div className={styles.deleteContainer}>
                  <p>Are you sure you want to delete this Operator?</p>
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
                      onClick={handleDeleteOperator}
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <form className={styles.addForm} onSubmit={handleAddOperator}>
            <div className={styles.formGroup}>
              <label>Username</label>
              <input
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className={styles.error}>{errors.username}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className={styles.error}>{errors.password}</p>
              )}
            </div>

            <button type="submit" className={styles.addBtn}>
              {creating ? "Adding..." : "Add Operator"}
            </button>
          </form>
        )}
      </div>
    </>
  );
}
