import React, { useEffect, useState } from "react";
import axios from "axios";
import UpvoteButton from "../components/upvoteButton";
import { FaFilter } from "react-icons/fa";

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

const Dashboard = () => {
  const token = localStorage.getItem("token");

  const [complaints, setComplaints] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [totals, setTotals] = useState({
    total: 0,
    inProgress: 0,
    resolved: 0,
  });

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/complaints`,
        {
          params: {
            sort: "priority",
            category,
            status,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = res.data;

      setComplaints(data);

      setTotals({
        total: data.length,
        inProgress: data.filter((c) => c.status === "In Progress").length,
        resolved: data.filter((c) => c.status === "Resolved").length,
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [category, status]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <>
      <div className="filter-bar">
        <FaFilter />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Electrical">Electrical</option>
          <option value="Plumbing">Plumbing</option>
          <option value="Internet">Internet</option>
          <option value="Mess">Mess</option>
          <option value="Other">Other</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="Submitted">Submitted</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
      </div>

      {/* ===== CARDS ===== */}
      <section className="hc-cards">
        <div className="card">
          <div className="card-label">Total Complaints</div>
          <div className="card-value">{totals.total}</div>
        </div>

        <div className="card">
          <div className="card-label">In Progress</div>
          <div className="card-value">{totals.inProgress}</div>
        </div>

        <div className="card">
          <div className="card-label">Resolved</div>
          <div className="card-value">{totals.resolved}</div>
        </div>
      </section>

      {/* ===== TABLE ===== */}
      <section className="hc-recent">
        <h3>Complaints Overview</h3>

        <div className="table-wrap">
          <table className="hc-table">
            <thead>
              <tr>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <th>Severity</th>
                <th>Date</th>
                <th>Upvotes</th>
              </tr>
            </thead>

            <tbody>
              {complaints.map((c) => (
                <React.Fragment key={c._id}>
                  <tr
                    onClick={() => toggleExpand(c._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{c.author?.name || "Anonymous"}</td>
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
                  </tr>

                  {/* EXPANDED */}
                  {expandedId === c._id && (
                    <tr className="expanded-row">
                      <td colSpan="6">
                        <div className="complaint-details">
                          <p>
                            <strong>Title:</strong> {c.title}
                          </p>

                          <p>
                            <strong>Description:</strong> {c.description}
                          </p>

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
    </>
  );
};

export default Dashboard;
