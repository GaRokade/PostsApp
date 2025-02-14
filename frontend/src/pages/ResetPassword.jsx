import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { id, token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const res = await axios.post(`posts-app-iwjw.vercel.app/reset-password/${id}/${token}`, { password });

      if (res.data.Status === "Success") {
        setMessage("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setMessage(res.data.message);
      }
    } catch (error) {
      console.error("❌ Error resetting password:", error);
      setMessage("Error resetting password");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Update Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ResetPassword;
