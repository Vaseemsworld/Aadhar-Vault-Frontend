import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainProvider } from "./context/MainContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home.jsx";
import Login from "./auth/Login";
import Register from "./auth/Register";
import PrivateRoute from "./PrivateRoute";

import Layout from "./components/Layout.jsx";

import Dashboard from "./pages/Dashboard";
import AssignOrders from "./pages/AssignOrders";
import ProfileDashboard from "./pages/ProfileDashboard.jsx";
import CreateOrder from "./pages/CreateOrder.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Operators from "./pages/Operators.jsx";
import FingerprintViewer from "./pages/FingerprintViewer.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <MainProvider>
        <AuthProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/assign/:type/:orderId/fingerprints"
              element={<FingerprintViewer />}
            />
            {/* {/* Protected routes layout */}
            <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard/" element={<Dashboard />} />
                <Route path="/operators/" element={<Operators />} />
                <Route path="/assign/" element={<AssignOrders />} />
                <Route path="/entry-complaint/" element={<AssignOrders />} />
                <Route path="/profile/" element={<ProfileDashboard />} />
                <Route path="/create-order/" element={<CreateOrder />} />
              </Route>
            </Route>
          </Routes>
        </AuthProvider>
      </MainProvider>
    </BrowserRouter>
  );
}
