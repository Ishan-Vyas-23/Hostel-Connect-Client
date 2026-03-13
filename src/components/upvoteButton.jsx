import { useState } from "react";
import axios from "axios";
import "../styles/Upvote.css";

const UpvoteButton = ({ initialVotes, complaintId }) => {
  const [votes, setVotes] = useState(initialVotes);
  const [loading, setLoading] = useState(false);

  const handleUpvote = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:3000/api/upvotes/${complaintId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // backend should return updated vote count
      setVotes(res.data.upvotes);
    } catch (err) {
      console.error("Upvote failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="upvote-button" onClick={handleUpvote} disabled={loading}>
      ▲ {votes}
    </button>
  );
};

export default UpvoteButton;
