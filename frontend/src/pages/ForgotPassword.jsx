import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const ForgotPassword = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://posts-app-iwjw.vercel.app/api/forgot-password", { email });
      alert(res.data.Status === "Success" ? "Check your email for reset instructions" : res.data.message);
      if (res.data.Status === "Success") navigate("/login");
    } catch (error) {
      console.error("❌ Forgot password request failed:", error);
      alert("Error sending reset email");
    }
  };
  return (
    <div className="popup-overlay">
      <div className="popup">
        <button className="close-btn" onClick={onClose || (() => navigate("/"))}>&times;</button>
        <p className="header-text">Reset Your Password</p>
        <div className="popup-content">
          <form onSubmit={handleSubmit} className="form">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="create-btn" type="submit">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
