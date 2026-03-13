import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/dashboard.css";

const Sidebar = () => {
  return (
    <aside className="hc-sidebar">
      <div className="hc-brand">HostelConnect</div>

      <nav className="hc-nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "hc-nav-item active" : "hc-nav-item"
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/submit"
          className={({ isActive }) =>
            isActive ? "hc-nav-item active" : "hc-nav-item"
          }
        >
          Submit Complaint
        </NavLink>
        <NavLink
          to="/my-complaints"
          className={({ isActive }) =>
            isActive ? "hc-nav-item active" : "hc-nav-item"
          }
        >
          My Complaints
        </NavLink>
        <NavLink
          to="/notifications"
          className={({ isActive }) =>
            isActive ? "hc-nav-item active" : "hc-nav-item"
          }
        >
          Notifications
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "hc-nav-item active" : "hc-nav-item"
          }
        >
          Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
