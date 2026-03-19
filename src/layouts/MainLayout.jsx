import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from "axios";
import { Link } from "react-router-dom";
import { AiOutlineLogout } from "react-icons/ai";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MainLayout = () => {
  const token = localStorage.getItem("token");
  const [name, setName] = React.useState("");
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
      const data = res.data;
      setName(data.name);
    } catch (error) {
      console.log(error);
    }
  };

  const manageLogout = () => {
    try {
      localStorage.removeItem("token");
      toast.success("logged out");
      navigate("/");
    } catch (error) {
      toast.error("logout failed");
    }
  };

  React.useEffect(() => {
    fetchUserData();
  }, []);
  return (
    <div className="hc-app">
      <Sidebar />
      <div className="hc-main">
        <header className="hc-topbar">
          <div className="hc-title">Dashboard</div>
          <div className="hc-top-actions">
            <button className="icon-btn">🌙</button>
            <Link to={"/notifications"}>
              <button className="icon-btn">🔔</button>
            </Link>
            <Link to={"/profile"}>
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
