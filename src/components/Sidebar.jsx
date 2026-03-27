import { NavLink } from "react-router-dom";
import "../styles/dashboard.css";
import { FaRegEye } from "react-icons/fa6";
import { MdOutlineCreateNewFolder } from "react-icons/md";
import { MdManageAccounts } from "react-icons/md";

const Sidebar = ({ role, isOpen, onClose }) => {
  const canManage = ["admin", "warden", "staff"].includes(role);
  const canSubmit = ["resident", "staff"].includes(role);
  const isAdmin = role === "admin";
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
              <MdOutlineCreateNewFolder /> Submit Complaint
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
          <NavLink
            to="/notices"
            className={({ isActive }) =>
              isActive ? "hc-nav-item active" : "hc-nav-item"
            }
            onClick={onClose}
          >
            <FaRegEye /> View Notices
          </NavLink>

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
                to="/create-notice"
                className={({ isActive }) =>
                  isActive ? "hc-nav-item active" : "hc-nav-item"
                }
                onClick={onClose}
              >
                <MdOutlineCreateNewFolder /> Publish Notice
              </NavLink>
              {isAdmin ? (
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    isActive ? "hc-nav-item active" : "hc-nav-item"
                  }
                  onClick={onClose}
                >
                  <MdManageAccounts /> Manage Profiles
                </NavLink>
              ) : null}
              {isAdmin ? (
                <NavLink
                  to="/admin/create-user"
                  className={({ isActive }) =>
                    isActive ? "hc-nav-item active" : "hc-nav-item"
                  }
                  onClick={onClose}
                >
                  + Create User
                </NavLink>
              ) : null}

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
