import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/login.css";
import logo from "../../public/logo.png";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const checkServer = async () => {
      await fetch("https://hostel-connect-server.onrender.com/health");
    };

    checkServer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      toast.error("Please enter username and password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "https://hostel-connect-server.onrender.com/api/auth/login",
        {
          username,
          password,
        },
      );
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");

      await new Promise((r) => setTimeout(r, 700));
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Check credentials or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <img
          src={logo}
          alt="HostelConnect logo"
          className="logo"
          style={{ borderRadius: "10px" }}
        />
        <h1 className="title">Welcome Back</h1>
        <p className="subtitle">Login to access HostelConnect</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="field-label">Username</label>
          <input
            className="input"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />

          <label className="field-label">Password</label>
          <div className="password-row">
            <input
              className="input input-password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPass((s) => !s)}
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? "🙈" : "👁️"}
            </button>
          </div>

          <button className="signin-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <Link to="/forgot">Forgot Username / Password?</Link>
      </div>
    </div>
  );
};

export default Login;
