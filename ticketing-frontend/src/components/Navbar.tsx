import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-brand">FastReactTicket</div>
      <div className="nav-links">
        <Link 
          to="/dashboard" 
          className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
        >
          Dashboard
        </Link>
        <Link 
          to="/tickets" 
          className={`nav-link ${location.pathname.startsWith("/tickets") && location.pathname !== "/tickets/new" ? "active" : ""}`}
        >
          Tickets
        </Link>
        <Link 
          to="/tickets/new" 
          className={`nav-link ${location.pathname === "/tickets/new" ? "active" : ""}`}
        >
          Create Ticket
        </Link>
      </div>
      <div className="nav-user">
        <span className="nav-user-info">
          Logged in as: <span className="nav-username">{user.username}</span> ({user.role})
        </span>
        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </nav>
  );
}
