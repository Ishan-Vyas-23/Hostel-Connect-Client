import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/recover.css";
import axios from "axios";

const Recover = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/forgot-password`,
        {
          email,
        },
      );

      await new Promise((r) => setTimeout(r, 800));

      toast.success("Recovery details sent to email");
      setEmail("");
    } catch (err) {
      console.log(err);

      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recover-page">
      <div className="recover-card">
        <h1 className="recover-title">Recover Account</h1>

        <p className="recover-subtitle">
          Enter your registered hostel email. Your username and password will be
          sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="recover-form">
          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button type="submit">
            {loading ? "Sending..." : "Send Details"}
          </button>
        </form>

        <Link to="/" className="back-login">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default Recover;
