import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Login.css";
import logo from "/logo.png"; // put your logo in public/logo.png or adjust path
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation
    if (!username.trim() || !password) {
      toast.error("Please enter username and password");
      return;
    }

    setLoading(true);

    try {
      // TODO: integrate axios call to your backend here.
      // Example (uncomment & adjust when backend ready):
      const res = await axios.post("http://localhost:3000/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful");

      // For now, simulate success:
      await new Promise((r) => setTimeout(r, 700));
      toast.success("Login successful");
      // navigate to dashboard or home after login
      navigate("/dashboard"); // change later to your actual protected route
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
        <img src={logo} alt="HostelConnect logo" className="logo" />
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
