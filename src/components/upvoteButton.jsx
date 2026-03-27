import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/upvote.css";
import { BiUpvote } from "react-icons/bi";
import { BiSolidUpvote } from "react-icons/bi";

const UpvoteButton = ({ complaintId, initialVotes, initialVoted }) => {
  const [votes, setVotes] = useState(initialVotes);
  const [loading, setLoading] = useState(false);

  const [hasVoted, setHasVoted] = useState(initialVoted);

  useEffect(() => {
    setHasVoted(initialVoted);
  }, [initialVoted]);

  const handleUpvote = async (e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/upvotes/${complaintId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setVotes(res.data.upvotes);
      setHasVoted(res.data.upvoted);
    } catch (err) {
      console.error("Upvote failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`upvote-button ${hasVoted ? "voted" : ""}`}
      onClick={handleUpvote}
    >
      {!hasVoted ? <BiUpvote /> : <BiSolidUpvote />} {votes}
    </button>
  );
};

export default UpvoteButton;
