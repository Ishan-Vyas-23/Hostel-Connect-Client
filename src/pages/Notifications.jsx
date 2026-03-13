import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/notifications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(res.data);
    } catch (err) {
      console.error("Notification fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // update local state
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error("Mark read failed", err);
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="notifications-page">
      <h2 className="page-title">Notifications</h2>

      <div className="notifications-list">
        {notifications.length === 0 && <p>No notifications yet</p>}

        {notifications.map((n) => (
          <div
            key={n._id}
            className={`notification-card ${n.read ? "read" : "unread"}`}
            onClick={() => markAsRead(n._id)}
          >
            <div className="notification-icon">
              {n.type === "complaint_status" && "⚡"}
              {n.type === "upvote" && "👍"}
              {n.type === "resolved" && "✅"}
              {!n.type && "🔔"}
            </div>

            <div className="notification-content">
              <p>
                <strong>{n.title}</strong>
                {n.title && " - "}
                {n.message}
              </p>

              <span>{new Date(n.createdAt).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
