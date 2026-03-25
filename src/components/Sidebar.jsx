import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/dashboard.css";

const Sidebar = ({ role, isOpen, onClose }) => {
  const canManage = ["admin", "warden", "staff"].includes(role);
  const canSubmit = ["admin", "resident", "staff"].includes(role);

  return (
    <>
      <div
        className={`hc-sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
      />

      <aside className={`hc-sidebar ${isOpen ? "open" : ""}`}>
        <div className="hc-brand">HostelConnect</div>

        <nav className="hc-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "hc-nav-item active" : "hc-nav-item"
            }
            onClick={onClose}
          >
            📊 Dashboard
          </NavLink>

          {canSubmit ? (
            <NavLink
            to="/submit"
            className={({ isActive }) =>
              isActive ? "hc-nav-item active" : "hc-nav-item"
            }
            onClick={onClose}
          >
            📝 Submit Complaint
          </NavLink>
          ) : null}
          
          {canSubmit ? (
          <NavLink
            to="/my-complaints"
            className={({ isActive }) =>
              isActive ? "hc-nav-item active" : "hc-nav-item"
            }
            onClick={onClose}
          >
            📋 My Complaints
          </NavLink>
          ) : null}

          {canManage && (
            <>
              <NavLink
                to="/manage-complaints"
                className={({ isActive }) =>
                  isActive ? "hc-nav-item active" : "hc-nav-item"
                }
                onClick={onClose}
              >
                🛠 Manage Complaints
              </NavLink>

              <NavLink
                to="/feedbacks"
                className={({ isActive }) =>
                  isActive ? "hc-nav-item active" : "hc-nav-item"
                }
                onClick={onClose}
              >
                💬 Feedbacks
              </NavLink>
            </>
          )}

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              isActive ? "hc-nav-item active" : "hc-nav-item"
            }
            onClick={onClose}
          >
            🔔 Notifications
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "hc-nav-item active" : "hc-nav-item"
            }
            onClick={onClose}
          >
            👤 Profile
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
