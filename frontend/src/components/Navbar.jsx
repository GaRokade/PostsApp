import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { AuthContext } from "../context/AuthContext";
import "../App.css";

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext); // Ensure setUser is available
  const navigate = useNavigate(); // Hook for navigation

  const handleLogout = () => {
    setUser(null); // Clear user authentication
    localStorage.removeItem("user"); // Remove stored user data (if using localStorage)
    navigate("/"); // Redirect to Home after logout
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">MyApp</Link>
      </div>
      <div>
        <Link to="/" className="nav-link">Home</Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
               <Link to="/profile" className="profile-nav">
              <img src={user.profilePic || "/profile.jpg"} alt="Profile" className="profile-img" />
              <span className="username">{user.firstName}</span>
            </Link>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
