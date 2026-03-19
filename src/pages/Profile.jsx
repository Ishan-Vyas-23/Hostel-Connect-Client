import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/profile.css";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/auth/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Password updated successfully");

      setEditing(false);
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setUser(res.data);
      } catch (err) {
        console.error("Profile fetch failed", err);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <h2 className="page-title">Profile</h2>

      <div className="profile-grid">
        <div className="profile-card">
          <img
            src={
              user.profilePhotoUrl ||
              "https://ui-avatars.com/api/?name=" + user.name
            }
            alt="profile"
            className="profile-avatar"
          />

          <h3>{user.name}</h3>

          <p className="student-id">Enrollment: {user.enrolmentNo}</p>

          {!editing ? (
            <button className="btn-primary" onClick={() => setEditing(true)}>
              Edit Profile
            </button>
          ) : (
            <div className="password-box">
              <div className="form-container">
                <input
                  type="password"
                  className="form-input"
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />

                <input
                  type="password"
                  className="form-input"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    className="btn btn-primary"
                    onClick={handleChangePassword}
                  >
                    Update Password
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hostel-card">
          <h3>Hostel Details</h3>

          <div className="detail-row">
            <span>Hostel</span>
            <span>{user.hostel}</span>
          </div>

          <div className="detail-row">
            <span>Block</span>
            <span>{user.block}</span>
          </div>

          <div className="detail-row">
            <span>Room</span>
            <span>{user.room}</span>
          </div>

          <div className="detail-row">
            <span>Email</span>
            <span>{user.email}</span>
          </div>

          <div className="detail-row">
            <span>Username</span>
            <span>{user.username}</span>
          </div>

          <div className="detail-row">
            <span>Year</span>
            <span>{user.year}</span>
          </div>

          <div className="detail-row">
            <span>Role</span>
            <span>{user.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
