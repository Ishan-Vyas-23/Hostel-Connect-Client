import { useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import UpvoteButton from "../components/upvoteButton";

const StatusBadge = ({ status }) => {
  const map = {
    Submitted: "badge-submitted",
    "In Progress": "badge-progress",
    Resolved: "badge-resolved",
    Closed: "badge-closed",
  };

  return <span className={`status-badge ${map[status] || ""}`}>{status}</span>;
};

const SeverityBadge = ({ severity }) => {
  const map = {
    low: "severity-low",
    medium: "severity-medium",
    high: "severity-high",
  };

  return (
    <span className={`severity-badge ${map[severity] || ""}`}>{severity}</span>
  );
};

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [description, setDescription] = useState("");

  const token = localStorage.getItem("token");

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/complaints/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setComplaints(res.data);
    } catch (err) {
      console.error("Fetch failed", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const startEdit = (c, e) => {
    e.stopPropagation();
    setEditId(c._id);
    setExpandedId(c._id);
    setDescription(c.description);
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/complaints/${id}`,
        { description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setComplaints((prev) => prev.map((c) => (c._id === id ? res.data : c)));

      setEditId(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    if (!window.confirm("Delete this complaint?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/complaints/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setComplaints((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <section className="hc-recent">
      <h3>My Complaints</h3>

      <div className="table-wrap">
        <table className="hc-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Severity</th>
              <th>Date</th>
              <th>Upvotes</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <React.Fragment key={c._id}>
                <tr
                  onClick={() => toggleExpand(c._id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>{c.title}</td>

                  <td>{c.category}</td>

                  <td>
                    <StatusBadge status={c.status} />
                  </td>

                  <td>
                    <SeverityBadge severity={c.severity} />
                  </td>

                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>

                  <td>
                    <UpvoteButton
                      complaintId={c._id}
                      initialVotes={c.upvotesCount || 0}
                      initialVoted={c.userHasUpvoted}
                    />
                  </td>

                  <td onClick={(e) => e.stopPropagation()}>
                    <button onClick={(e) => startEdit(c, e)}>✏️</button>
                    <button onClick={(e) => handleDelete(c._id, e)}>🗑️</button>
                  </td>
                </tr>

                {expandedId === c._id && (
                  <tr className="expanded-row">
                    <td colSpan="7">
                      <div className="complaint-details">
                        {editId === c._id ? (
                          <>
                            <textarea
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              style={{ width: "100%", minHeight: "80px" }}
                            />

                            <div style={{ marginTop: "10px" }}>
                              <button onClick={() => handleUpdate(c._id)}>
                                💾 Save
                              </button>
                              <button onClick={() => setEditId(null)}>
                                ❌ Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <p>
                              <strong>Description:</strong> {c.description}
                            </p>

                            <button onClick={(e) => startEdit(c, e)}>
                              ✏️ Edit Description
                            </button>
                          </>
                        )}

                        <p>
                          <strong>Hostel:</strong> {c.location?.hostel}
                        </p>
                        <p>
                          <strong>Block:</strong> {c.location?.block}
                        </p>
                        <p>
                          <strong>Room:</strong> {c.location?.room}
                        </p>

                        {c.resolution && (
                          <p>
                            <strong>Resolution:</strong> {c.resolution.text}
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MyComplaints;
