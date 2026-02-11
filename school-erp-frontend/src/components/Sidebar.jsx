import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const role = localStorage.getItem("role");
  const dashboardPath =
    role === "admin"
      ? "/admin"
      : role === "student"
      ? "/student"
      : role === "parent"
      ? "/parent/dashboard"
      : role === "teacher"
      ? "/teacher/dashboard"
      : "/login";

  const menuItems = [
    { id: "dashboard", label: "Dashboard", path: dashboardPath, icon: "📊" },
  ];

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                className={`sidebar-item ${
                  location.pathname === item.path ? "active" : ""
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
