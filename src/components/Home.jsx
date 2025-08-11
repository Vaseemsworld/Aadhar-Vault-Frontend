import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AadhaarLoader from "../pages/Loader";

export default function Home() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      <AadhaarLoader />;
      return;
    }
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [user, loading, navigate]);
  return;
}
