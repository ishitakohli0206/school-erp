import { useNavigate } from "react-router-dom";
import { logout } from "../utils/logout";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    logout(navigate);
  };

  const handleLogoClick = () => {
    if (role === "admin") navigate("/admin");
    else if (role === "student") navigate("/student");
    else if (role === "parent") navigate("/parent");
    else navigate("/login");
  };

  const roleLabel =
    role === "admin" ? "Admin" : role === "student" ? "Student" : role === "parent" ? "Parent" : "Guest";

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left" onClick={handleLogoClick}>
          <h1 className="navbar-logo">School ERP</h1>
        </div>
        <div className="navbar-right">
          <span className="navbar-role">{roleLabel}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
