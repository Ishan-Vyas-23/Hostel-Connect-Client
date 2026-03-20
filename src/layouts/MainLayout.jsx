import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { AiOutlineLogout } from "react-icons/ai";
import { toast } from "react-toastify";

const PAGE_TITLES = {
  "/dashboard": "Dashboard",
  "/submit": "Submit Complaint",
  "/my-complaints": "My Complaints",
  "/manage-complaints": "Manage Complaints",
  "/feedbacks": "Feedbacks",
  "/notifications": "Notifications",
  "/profile": "Profile",
};

const MainLayout = () => {
  const token = localStorage.getItem("token");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = PAGE_TITLES[location.pathname] ?? "Dashboard";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode((prev) => !prev);
  };

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/me/`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setName(res.data.name);
      setRole(res.data.role);
    } catch (error) {
      console.log(error);
    }
  };

  const manageLogout = () => {
    try {
      localStorage.removeItem("token");
      toast.success("Logged out");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="hc-app">
      <Sidebar
        role={role}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="hc-main">
        <header className="hc-topbar">
          <div className="hc-topbar-left">
            <button
              className="hc-hamburger"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Toggle menu"
            >
              {sidebarOpen ? "✕" : "☰"}
            </button>

            <div className="hc-title">{pageTitle}</div>
          </div>

          <div className="hc-top-actions">
            <button
              className="icon-btn"
              onClick={toggleTheme}
              title="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <Link to="/notifications">
              <button className="icon-btn" title="Notifications">
                🔔
              </button>
            </Link>

            <Link to="/profile">
              <button className="admin-btn">{name}</button>
            </Link>

            <button className="icon-btn" onClick={manageLogout} title="Logout">
              <AiOutlineLogout size={18} />
            </button>
          </div>
        </header>

        <main className="hc-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
