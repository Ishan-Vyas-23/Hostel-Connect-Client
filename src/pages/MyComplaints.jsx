import { useEffect, useState } from "react";
import axios from "axios";
import UpvoteButton from "../components/upvoteButton";

const StatusBadge = ({ status }) => {
  const map = {
    Submitted: "badge-submitted",
    "In Progress": "badge-progress",
    Resolved: "badge-resolved",
    Closed: "badge-closed",
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

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchComplaints = async () => {
    try {
      const res = await axios.get(
        "https://hostel-connect-server.onrender.com/api/complaints/my",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setComplaints(res.data);
    } catch (err) {
      console.error("Fetch my complaints failed", err);
    }
  };

  useEffect(() => {
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
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <>
                <tr
                  key={c._id}
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
                    />
                  </td>
                </tr>

                {expandedId === c._id && (
                  <tr className="expanded-row">
                    <td colSpan="6">
                      <div className="complaint-details">
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
              </>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MyComplaints;
