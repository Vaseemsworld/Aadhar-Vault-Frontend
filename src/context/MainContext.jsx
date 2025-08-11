import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const MainContext = createContext();

export const MainProvider = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("Dashboard");

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  useEffect(() => {
    const segments = location.pathname.split("/").filter(Boolean);
    const formattedPath =
      segments.length > 0 ? segments.map(capitalize).join(" > ") : "Dashboard";

    setCurrentPath(formattedPath);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <MainContext.Provider value={{ isSidebarOpen, toggleSidebar, currentPath }}>
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => useContext(MainContext);
