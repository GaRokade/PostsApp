import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import axios from "axios";
const Register = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/signup", formData);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error signing up");
    }
  };
  const navigate = useNavigate();
  return (
    <div className="popup-overlay" id="popup">
      <div className="popup">
      <p className="header-text">
          Let's learn, share & inspire each other with our passion for computer engineering. <span>Sign up now 🤘</span>
        </p>
         <button className="close-btn" onClick={() => navigate("/")}>
          &times;
        </button>

        
        <h2>Create Account</h2>
        <p className="signin-text">Already have an account? <a href="/login">Sign In</a></p>

        <div className="popup-content">
          <div className="form">
          <form className="form" onSubmit={handleSubmit}>
            <div className="name-fields">
              <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
              <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
            </div>
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} required />

            <button className="create-btn" type="submit">Create Account</button>
          </form>

          {message && <p className="message">{message}</p>}
            <button className="social-btn fb-btn">
              <img src="facebook.svg" alt="facebook" /> Sign Up with Facebook
            </button>
            <button className="social-btn google-btn">
  <img src="gog.jpg" alt="google" height={"23px"}/> Sign Up with Google
</button>

            
          </div>
          <div className="illustration">
            <img src="signup.svg" alt="Sign Up" />
            <p className="terms">
              By signing up, you agree to our <a href="#">Terms & conditions</a>, <a href="#">Privacy policy</a>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Register;
