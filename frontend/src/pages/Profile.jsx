import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa"; // Import edit icon
import "./Profile.css"; // Import CSS file

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUpdatedUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user JSON:", error);
      }
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setUpdatedUser(user);
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setUpdatedUser({ ...updatedUser, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <h2>Please log in to view your profile.</h2>;
  }

  return (
    <div className="profile-container">
      <h1 className="profile-title">Welcome, {user.firstName}_{user.lastName}!</h1>
      
      <div className="profile-image-container">
        <img 
          src={profileImage || user.profileImage || "https://via.placeholder.com/150"} 
          alt="Profile" 
          className="profile-image"
        />
        <label className="edit-photo-icon">
          <FaEdit size={20} />
          <input type="file" accept="image/*" onChange={handleImageChange} hidden />
        </label>
      </div>

      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={updatedUser.firstName}
            onChange={(e) => setUpdatedUser({ ...updatedUser, firstName: e.target.value })}
            placeholder="First Name"
          />
          <input
            type="text"
            value={updatedUser.lastName}
            onChange={(e) => setUpdatedUser({ ...updatedUser, lastName: e.target.value })}
            placeholder="Last Name"
          />
          <input
            type="text"
            value={updatedUser.username || ""}
            onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
            placeholder="Username"
          />
          <input
            type="date"
            value={updatedUser.dob || ""}
            onChange={(e) => setUpdatedUser({ ...updatedUser, dob: e.target.value })}
            placeholder="Date of Birth"
          />
          <input
            type="text"
            value={updatedUser.profession || ""}
            onChange={(e) => setUpdatedUser({ ...updatedUser, profession: e.target.value })}
            placeholder="Profession"
          />
          <button className="save-btn" onClick={handleSave}>Save</button>
          <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div className="profile-details">
          <p>Email: {user.email}</p>
          <p>Username: {user.firstName}_{user.lastName}</p>
          <p>Date of Birth: {user.dob || "N/A"}</p>
          <p>Profession: {user.profession || "N/A"}</p>
          <button className="edit-btn" onClick={handleEdit}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
