import React, { useState,useContext } from "react"; // ✅ Correct useState import
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../App.css"; // ✅ Correct import of external CSS file
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext"; // ✅ Import AuthContext

 
const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const res = await axios.post("http://localhost:5000/api/login", formData, {
        headers: { "Content-Type": "application/json" },
      });
  
      setMessage(res.data.message);
  
      // ✅ Store auth token and user details in localStorage
      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
  
      // Redirect to profile page after login
      navigate("/postlist");
    } catch (error) {
      console.error("Login Error:", error.response?.data || error);
      setMessage(error.response?.data?.message || "Error logging in");
    }
  };
  

  const handleForgotPassword = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/forgot-password", { email: forgotEmail });
      setForgotMessage(res.data.message);
    } catch (err) {
      console.error("Error resetting password", err);
      setForgotMessage("Failed to reset password");
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup">
        {/* Close button, calls onClose when clicked */}
        <button className="close-btn" onClick={onClose ? onClose : () => navigate("/")}>
  &times;
</button>



        <p className="header-text">
          Let's learn, share & inspire each other with our passion for computer engineering. Sign up now 🤘🏼
        </p>
        
        <h2>Sign In</h2>
        <p className="signin-text">
          Don't have an account yet? <a href="/register">Create new for free</a>
        </p>

        <div className="popup-content">
          <div className="form">
          <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                required
              />
              <button className="create-btn" type="submit">
                Sign In
              </button>
            </form>


          {message && <p className="message">{message}</p>}

            <button className="social-btn fb-btn">
              <img src="facebook.svg" alt="facebook" /> Sign in with Facebook
            </button>
            <button className="social-btn google-btn">
              <img src="gog.jpg" alt="google" height="23px" /> Sign in with Google
            </button>

            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <div className="illustration">
            <img src="signup.svg" alt="Sign Up" />
          </div>
        </div>
      </div>
      {showForgotPassword && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-btn" onClick={() => setShowForgotPassword(false)}>&times;</button>
            <h2>Reset Password</h2>
            <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="Enter your email" required />
            <button onClick={handleForgotPassword}>Reset Password</button>
            {forgotMessage && <p>{forgotMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;