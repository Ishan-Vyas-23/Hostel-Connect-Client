import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { AiOutlineLogout } from "react-icons/ai";
import { toast } from "react-toastify";

const MainLayout = () => {
  const token = localStorage.getItem("token");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/me/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
      <Sidebar role={role} />

      <div className="hc-main">
        <header className="hc-topbar">
          <div className="hc-title">Dashboard</div>

          <div className="hc-top-actions">
            <button className="icon-btn">🌙</button>

            <Link to="/notifications">
              <button className="icon-btn">🔔</button>
            </Link>

            <Link to="/profile">
              <button className="admin-btn">{name}</button>
            </Link>

            <AiOutlineLogout
              style={{ cursor: "pointer" }}
              onClick={manageLogout}
            />
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
