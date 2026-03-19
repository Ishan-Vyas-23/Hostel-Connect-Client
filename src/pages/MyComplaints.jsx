import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import UpvoteButton from "../components/upvoteButton";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";

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

  const [feedbackOpenId, setFeedbackOpenId] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState("5");
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmittingId, setFeedbackSubmittingId] = useState(null);

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
      console.error("Fetch my complaints failed", err);
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
      toast.success("Complaint updated");
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Update failed");
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
      toast.success("Complaint deleted");
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Delete failed");
    }
  };

  const openFeedbackForm = (c, e) => {
    e.stopPropagation();
    if (c.status !== "Resolved") return;

    setFeedbackOpenId(c._id);
    setFeedbackRating("5");
    setFeedbackComment("");
  };

  const handleSubmitFeedback = async (complaintId) => {
    try {
      setFeedbackSubmittingId(complaintId);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/feedback/${complaintId}`,
        {
          rating: Number(feedbackRating),
          comment: feedbackComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newFeedback = res.data;

      setComplaints((prev) =>
        prev.map((c) =>
          c._id === complaintId
            ? {
                ...c,
                myFeedback: newFeedback,
              }
            : c,
        ),
      );

      setFeedbackOpenId(null);
      setFeedbackComment("");
      setFeedbackRating("5");
      toast.success("Feedback submitted");
    } catch (err) {
      console.error("Feedback submit failed", err);
      toast.error(err.response?.data?.message || "Feedback submit failed");
    } finally {
      setFeedbackSubmittingId(null);
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
                    <button
                      style={{ borderRadius: "5px" }}
                      onClick={(e) => startEdit(c, e)}
                    >
                      <CiEdit
                        style={{ fontSize: "1.2rem", cursor: "pointer" }}
                      />
                    </button>
                    <button
                      style={{ borderRadius: "5px" }}
                      onClick={(e) => handleDelete(c._id, e)}
                    >
                      <MdDelete
                        style={{ fontSize: "1.2rem", cursor: "pointer" }}
                      />
                    </button>
                  </td>
                </tr>

                {expandedId === c._id && (
                  <tr className="expanded-row">
                    <td colSpan="7">
                      <div className="complaint-details">
                        {editId === c._id ? (
                          <>
                            <div className="form-container">
                              <textarea
                                className="form-textarea"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              />

                              <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                  className="btn btn-primary"
                                  onClick={() => handleUpdate(c._id)}
                                >
                                  Save
                                </button>

                                <button
                                  className="btn btn-secondary"
                                  onClick={() => setEditId(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <p>
                              <strong>Description:</strong> {c.description}
                            </p>

                            <button
                              className="btn-primary"
                              onClick={(e) => startEdit(c, e)}
                            >
                              Edit Description
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

                        <div style={{ marginTop: "16px" }}>
                          {c.status === "Resolved" && !c.myFeedback && (
                            <>
                              {feedbackOpenId !== c._id ? (
                                <button
                                  className="btn-primary"
                                  onClick={(e) => openFeedbackForm(c, e)}
                                >
                                  Give Feedback
                                </button>
                              ) : (
                                <div className="feedback-box">
                                  <div className="form-container">
                                    <label>Rating</label>

                                    <select
                                      className="form-select"
                                      value={feedbackRating}
                                      onChange={(e) =>
                                        setFeedbackRating(e.target.value)
                                      }
                                    >
                                      <option value="1">⭐</option>
                                      <option value="2">⭐⭐</option>
                                      <option value="3">⭐⭐⭐</option>
                                      <option value="4">⭐⭐⭐⭐</option>
                                      <option value="5">⭐⭐⭐⭐⭐</option>
                                    </select>

                                    <textarea
                                      className="form-textarea"
                                      placeholder="Write your feedback..."
                                      value={feedbackComment}
                                      onChange={(e) =>
                                        setFeedbackComment(e.target.value)
                                      }
                                    />

                                    <button
                                      className="btn btn-primary"
                                      onClick={() =>
                                        handleSubmitFeedback(c._id)
                                      }
                                      disabled={feedbackSubmittingId === c._id}
                                    >
                                      {feedbackSubmittingId === c._id
                                        ? "Submitting..."
                                        : "Submit Feedback"}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </>
                          )}

                          {c.myFeedback && (
                            <div style={{ marginTop: "12px" }}>
                              <p>
                                <strong>Your Feedback:</strong>
                              </p>
                              <p>Rating: {c.myFeedback.rating}/5</p>
                              <p>
                                Comment: {c.myFeedback.comment || "No comment"}
                              </p>
                              <p>
                                Submitted on:{" "}
                                {new Date(
                                  c.myFeedback.createdAt,
                                ).toLocaleString()}
                              </p>
                            </div>
                          )}

                          {c.status !== "Resolved" && !c.myFeedback && (
                            <p style={{ marginTop: "10px" }}>
                              Feedback becomes available after the complaint is
                              resolved.
                            </p>
                          )}
                        </div>
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
