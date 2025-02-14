import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Remove user data from localStorage or sessionStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    
    // Clear user state in AuthContext
    setUser(null);

    // Redirect to login page
    navigate("/login");
  }, [setUser, navigate]);

  return <p>Logging out...</p>;
};

export default Logout;
