import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/notices.css";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const fetchNotices = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notices`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  return (
    <section className="hc-recent">
      <h3>Notices</h3>

      {loading ? (
        <div className="notices-empty">
          <span className="notices-empty-icon">⏳</span>
          Loading notices…
        </div>
      ) : notices.length === 0 ? (
        <div className="notices-empty">
          <span className="notices-empty-icon">📭</span>
          No notices yet.
        </div>
      ) : (
        <div className="notices-list">
          {notices.map((n) => (
            <div key={n._id} className="notice-card">
              <h4>{n.title}</h4>
              <p>{n.content}</p>

              <div className="notice-meta">
                {n.role && <span className="notice-role">{n.role}</span>}
                <span>{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Notices;
