import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import "./App.css"; // Import external CSS file
import "./Style.css";
export default function App() {
  const { user } = useContext(AuthContext); // Get user from context

  return (
    <div className="container">
      <h1 className="heading">Welcome to Social Media App</h1>
      <div className="button-container">
        {user ? (
          <>
            <Link to="/feed" className="button feed">
              Go to Feed
            </Link>
            <Link to="/profile" className="button profile">
              Profile+
            </Link>
            <Link to="/logout" className="button logout">
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="button login">
              Login
            </Link>
            <Link to="/register" className="button register">
              Register
            </Link>
            
          </>
        )}
      </div>
    </div>
  );
}
