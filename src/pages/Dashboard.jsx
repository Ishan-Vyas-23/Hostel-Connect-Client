import React, { useEffect, useState } from "react";
import axios from "axios";
import UpvoteButton from "../components/upvoteButton";

const StatusBadge = ({ status }) => {
  const map = {
    High: "badge-high",
    Resolved: "badge-resolved",
    Pending: "badge-pending",
    "In Progress": "badge-progress",
  };

  const cls = map[status] || "badge-default";

  return <span className={`status-badge ${cls}`}>{status}</span>;
};
const SeverityBadge = ({ severity }) => {
  const map = {
    low: "severity-low",
    medium: "severity-medium",
    high: "severity-high",
  };

  const cls = map[severity] || "severity-low";

  return <span className={`severity-badge ${cls}`}>{severity}</span>;
};
const Dashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const [totals, setTotals] = useState({
    total: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/complaints?sort=priority`,
        );

        const data = res.data;

        setComplaints(data);

        const total = data.length;

        const inProgress = data.filter(
          (c) => c.status === "In Progress",
        ).length;

        const resolved = data.filter((c) => c.status === "Resolved").length;

        setTotals({
          total,
          inProgress,
          resolved,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchComplaints();
  }, []);

  const toggleExpand = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  return (
    <>
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

      <section className="hc-recent">
        <h3>Recent Complaints</h3>

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
                      />
                    </td>
                  </tr>

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

                          {c.adminFeedback && (
                            <p>
                              <strong>Admin Feedback:</strong> {c.adminFeedback}
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
