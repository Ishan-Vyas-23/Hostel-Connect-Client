import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);

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

          <button className="edit-btn">Edit Profile</button>
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
