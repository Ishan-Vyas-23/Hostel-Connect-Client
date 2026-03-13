import { useState } from "react";
import { toast } from "react-toastify";
import "../styles/SubmitComplaint.css";
import React from "react";
import axios from "axios";

const SubmitComplaint = () => {
  const [form, setForm] = useState({
    title: "",
    category: "",
    room: "",
    block: "",
    hostel: "",
    description: "",
  });

  const fetchUserData = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users/me/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = res.data;

      setForm((prev) => ({
        ...prev,
        hostel: data.hostel,
        block: data.block,
        room: data.room,
      }));
    } catch (error) {
      console.log(error);
    }
  };
  React.useEffect(() => {
    fetchUserData();
  }, []);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const token = localStorage.getItem("token");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.category || !form.description) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      // Later you will integrate axios here
      await axios.post("http://localhost:3000/api/complaints", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Complaint submitted successfully");

      setForm({
        title: "",
        category: "",
        description: "",
      });
    } catch (err) {
      toast.error("Failed to submit complaint");
      console.log(err);
    }
  };

  return (
    <div className="submit-page">
      <h2 className="page-title">Submit Complaint</h2>

      <div className="submit-card">
        <h3>Complaint Details</h3>

        <form onSubmit={handleSubmit}>
          <label>Complaint Title</label>
          <input
            type="text"
            placeholder="Enter complaint title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="Electrical">Electrical</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Internet">Internet</option>
            <option value="Mess">Mess</option>
            <option value="Other">Other</option>
          </select>

          <label>Complaint Description</label>
          <textarea
            rows="5"
            placeholder="Describe your issue in detail..."
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <button type="submit" className="submit-btn">
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitComplaint;
