import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/createNotice.css";

const CreateNotice = () => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    role: "all",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/notices`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Notice published");
      setForm({ title: "", content: "", role: "all" });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to publish notice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hc-recent create-notice-card">
      <h3>Create Notice</h3>

      <form className="create-notice-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            placeholder="e.g. Water supply disruption on Friday"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            placeholder="Write the full notice here…"
            value={form.content}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="role">Audience</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="all">All</option>
            <option value="resident">Residents</option>
            <option value="warden">Wardens</option>
            <option value="staff">Staff</option>
          </select>
        </div>

        <button className="publish-btn" type="submit" disabled={loading}>
          {loading ? "Publishing…" : "Publish Notice"}
        </button>
      </form>
    </section>
  );
};

export default CreateNotice;
