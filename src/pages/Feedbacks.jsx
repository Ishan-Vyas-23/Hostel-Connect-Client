import { useEffect, useState } from "react";
import axios from "axios";

const Feedbacks = () => {
  const [role, setRole] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const allowedRoles = ["admin", "warden", "staff"];

  const fetchData = async () => {
    try {
      const meRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/me/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const userRole = meRes.data.role;
      setRole(userRole);

      if (!allowedRoles.includes(userRole)) {
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/feedback`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setFeedbacks(res.data);
    } catch (err) {
      console.error("Failed to fetch feedbacks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading feedbacks...</div>;
  }

  if (!allowedRoles.includes(role)) {
    return (
      <div className="hc-recent">
        <h3>Access Denied</h3>
        <p>You do not have permission to view feedbacks.</p>
      </div>
    );
  }

  return (
    <section className="hc-recent">
      <h3>Feedbacks</h3>

      <div className="table-wrap">
        <table className="hc-table">
          <thead>
            <tr>
              <th>Complaint</th>
              <th>Student</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Complaint Status</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {feedbacks.length === 0 ? (
              <tr>
                <td colSpan="6">No feedback submitted yet.</td>
              </tr>
            ) : (
              feedbacks.map((f) => (
                <tr key={f._id}>
                  <td>
                    <strong>{f.complaint?.title}</strong>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {f.complaint?.category}
                    </div>
                  </td>

                  <td>
                    {f.user?.name || "Anonymous"}
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {f.user?.role || ""}
                    </div>
                  </td>

                  <td>{`${"★".repeat(f.rating)}${"☆".repeat(5 - f.rating)}`}</td>

                  <td>{f.comment || "-"}</td>

                  <td>{f.complaint?.status || "-"}</td>

                  <td>{new Date(f.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Feedbacks;
