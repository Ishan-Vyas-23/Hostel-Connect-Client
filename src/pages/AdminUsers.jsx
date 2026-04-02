import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/adminUsers.css";

const ROLE_CLASS = {
  resident: "role-resident",
  warden: "role-warden",
  staff: "role-staff",
  admin: "role-admin",
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [hostel, setHostel] = useState("");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    hostel: "",
    block: "",
    room: "",
    phone: "",
    year: "",
  });

  const [enrolmentSearch, setEnrolmentSearch] = useState("");

  const token = localStorage.getItem("token");

  // 🚀 FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          role,
          hostel,
          enrolmentNo: enrolmentSearch, // 🔥 THIS WAS MISSING
        },
      });

      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🧠 debounce (avoid 100 API calls while typing like a maniac)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(delay);
  }, [role, hostel, enrolmentSearch]);

  // ❌ DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  // ✏️ EDIT START
  const startEdit = (u) => {
    setEditId(u._id);
    setForm({
      hostel: u.hostel || "",
      block: u.block || "",
      room: u.room || "",
      phone: u.phone || "",
      year: u.year || "",
    });
  };

  // 💾 UPDATE USER
  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${id}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setUsers((prev) => prev.map((u) => (u._id === id ? res.data : u)));
      setEditId(null);
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
    }
  };

  return (
    <section className="hc-recent">
      <h3>Manage Users</h3>

      {/* 🔍 FILTER BAR */}
      <div className="filter-bar">
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All Roles</option>
          <option value="resident">Resident</option>
          <option value="warden">Warden</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <select value={hostel} onChange={(e) => setHostel(e.target.value)}>
          <option value="">All Hostels</option>
          <option value="A">Hostel A</option>
          <option value="B">Hostel B</option>
          <option value="C">Hostel C</option>
          <option value="D">Hostel D</option>
        </select>

        {/* 🔥 SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search by Enrolment No"
          value={enrolmentSearch}
          onChange={(e) => setEnrolmentSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-wrap">
        <table className="hc-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Hostel</th>
              <th>Room</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <React.Fragment key={u._id}>
                <tr>
                  <td>{u.name}</td>
                  <td>
                    <span className={`role-badge ${ROLE_CLASS[u.role] ?? ""}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.hostel || "—"}</td>
                  <td>{u.room || "—"}</td>
                  <td>
                    <div className="action-btns">
                      <button
                        className="action-btn edit"
                        onClick={() => startEdit(u)}
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(u._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>

                {editId === u._id && (
                  <tr className="edit-row">
                    <td colSpan="5">
                      <div className="edit-form">
                        <input
                          placeholder="Hostel"
                          value={form.hostel}
                          onChange={(e) =>
                            setForm({ ...form, hostel: e.target.value })
                          }
                        />
                        <input
                          placeholder="Block"
                          value={form.block}
                          onChange={(e) =>
                            setForm({ ...form, block: e.target.value })
                          }
                        />
                        <input
                          placeholder="Room"
                          value={form.room}
                          onChange={(e) =>
                            setForm({ ...form, room: e.target.value })
                          }
                        />
                        <input
                          placeholder="Phone"
                          value={form.phone}
                          onChange={(e) =>
                            setForm({ ...form, phone: e.target.value })
                          }
                        />

                        <div className="edit-form-actions">
                          <button onClick={() => handleUpdate(u._id)}>
                            Save
                          </button>
                          <button onClick={() => setEditId(null)}>
                            Cancel
                          </button>
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

export default AdminUsers;
