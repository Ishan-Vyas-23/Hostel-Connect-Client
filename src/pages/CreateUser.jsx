import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/createUser.css";

const CreateUser = () => {
  const token = localStorage.getItem("token");

  const emptyForm = {
    name: "",
    username: "",
    email: "",
    enrolmentNo: "",
    password: "",
    role: "resident",
    hostel: "",
    block: "",
    room: "",
    phone: "",
    year: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/create`,
        form,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      toast.success("User created successfully");
      setForm(emptyForm);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hc-recent">
      <h3>Create New User</h3>

      <form className="create-user-form" onSubmit={handleSubmit}>
        {/* ── Personal Info ── */}
        <div className="form-section-label">Personal Info</div>

        <div className="form-field">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            placeholder="e.g. Ishan Vyas"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            placeholder="e.g. ishan_vyas"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="e.g. ishan@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            placeholder="e.g. 9876543210"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        {/* ── Account Info ── */}
        <div className="form-section-label">Account Info</div>

        <div className="form-field">
          <label htmlFor="enrolmentNo">Enrolment No</label>
          <input
            id="enrolmentNo"
            name="enrolmentNo"
            placeholder="e.g. 0827CS221099"
            value={form.enrolmentNo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field full-width">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="resident">Resident</option>
            <option value="warden">Warden</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* ── Hostel Details ── */}
        <div className="form-section-label">Hostel Details</div>

        <div className="form-field">
          <label htmlFor="hostel">Hostel</label>
          <input
            id="hostel"
            name="hostel"
            placeholder="e.g. H1"
            value={form.hostel}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="year">Year</label>
          <input
            id="year"
            name="year"
            placeholder="e.g. 3"
            value={form.year}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="block">Block</label>
          <input
            id="block"
            name="block"
            placeholder="e.g. A"
            value={form.block}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="room">Room</label>
          <input
            id="room"
            name="room"
            placeholder="e.g. 204"
            value={form.room}
            onChange={handleChange}
          />
        </div>

        {/* ── Submit ── */}
        <div className="form-submit-row">
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create User"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreateUser;
