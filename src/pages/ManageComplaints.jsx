import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const StatusBadge = ({ status }) => {
  const map = {
    Submitted: "badge-submitted",
    "In Progress": "badge-progress",
    Resolved: "badge-resolved",
    Closed: "badge-closed",
    Reopened: "badge-reopened",
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

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [statusDraft, setStatusDraft] = useState({});
  const [resolutionDraft, setResolutionDraft] = useState({});
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const allowedRoles = ["admin", "warden", "staff"];

  const fetchData = async () => {
    try {
      const userRes = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const userRole = userRes.data.role;
      setRole(userRole);

      if (!allowedRoles.includes(userRole)) {
        setLoading(false);
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/complaints/manage?sort=priority`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setComplaints(res.data);

      const s = {};
      const r = {};

      res.data.forEach((c) => {
        s[c._id] = c.status;
        r[c._id] = "";
      });

      setStatusDraft(s);
      setResolutionDraft(r);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleUpdate = async (id) => {
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/complaints/${id}/status`,
        {
          status: statusDraft[id],
          resolutionText: resolutionDraft[id],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setComplaints((prev) => prev.map((c) => (c._id === id ? res.data : c)));

      toast.success("Status updated");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!allowedRoles.includes(role)) {
    return (
      <div className="hc-recent">
        <h3>Access Denied</h3>
      </div>
    );
  }

  return (
    <section className="hc-recent">
      <h3>Manage Complaints</h3>

      <div className="table-wrap">
        <table className="hc-table">
          <thead>
            <tr>
              <th>Author</th>
              <th>Title</th>
              <th>Status</th>
              <th>Severity</th>
              <th>Date</th>
              <th>Upvotes</th>
            </tr>
          </thead>

          <tbody>
            {complaints.map((c) => (
              <>
                <tr key={c._id} onClick={() => toggleExpand(c._id)}>
                  <td>{c.author?.name || "Anonymous"}</td>
                  <td>{c.title}</td>
                  <td>
                    <StatusBadge status={c.status} />
                  </td>
                  <td>
                    <SeverityBadge severity={c.severity} />
                  </td>
                  <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td>{c.upvotesCount || 0}</td>
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

                        <div style={{ marginTop: "10px" }}>
                          <select
                            value={statusDraft[c._id]}
                            onChange={(e) =>
                              setStatusDraft({
                                ...statusDraft,
                                [c._id]: e.target.value,
                              })
                            }
                          >
                            <option>Submitted</option>
                            <option>In Progress</option>
                            <option>Resolved</option>
                            <option>Closed</option>
                            <option>Reopened</option>
                          </select>
                        </div>

                        <textarea
                          placeholder="Add resolution..."
                          value={resolutionDraft[c._id]}
                          onChange={(e) =>
                            setResolutionDraft({
                              ...resolutionDraft,
                              [c._id]: e.target.value,
                            })
                          }
                        />

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdate(c._id);
                          }}
                        >
                          Save
                        </button>
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

export default ManageComplaints;
