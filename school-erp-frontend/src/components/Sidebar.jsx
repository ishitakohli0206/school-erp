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

  const menuItems = [{ id: "dashboard", label: "Dashboard", path: dashboardPath, icon: "DB" }];

  if (role === "admin") {
    menuItems.push(
      { id: "students", label: "Students", path: "/students", icon: "ST" },
      { id: "attendance", label: "Attendance", path: "/attendance", icon: "AT" },
      { id: "reports", label: "Reports", path: "/reports", icon: "RP" },
      { id: "erp", label: "ERP Modules", path: "/admin/erp", icon: "ERP" },
      { id: "operations", label: "Operations", path: "/admin/operations", icon: "OP" }
    );
  }

  if (role === "teacher") {
    menuItems.push(
      { id: "classes", label: "Classes", path: "/teacher/classes", icon: "CL" },
      { id: "students", label: "Students", path: "/teacher/students", icon: "ST" },
      { id: "attendance", label: "Attendance", path: "/teacher/attendance", icon: "AT" },
      { id: "academics", label: "Academics", path: "/teacher/academics", icon: "AC" },
      { id: "communication", label: "Communication", path: "/teacher/communication", icon: "CM" }
    );
  }

  if (role === "student") {
    menuItems.push(
      { id: "attendance", label: "Attendance", path: "/attendance", icon: "AT" },
      { id: "academics", label: "Academics", path: "/student/academics", icon: "AC" },
      { id: "profile", label: "Profile", path: "/student/profile", icon: "PR" }
    );
  }

  if (role === "parent") {
    menuItems.push(
      { id: "attendance", label: "Attendance", path: "/parent/attendance", icon: "AT" },
      { id: "academics", label: "Academics", path: "/parent/academics", icon: "AC" },
      { id: "notifications", label: "Notifications", path: "/parent/notifications", icon: "NT" },
      { id: "profile", label: "Profile", path: "/parent/profile", icon: "PR" }
    );
  }

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
                className={`sidebar-item ${location.pathname === item.path ? "active" : ""}`}
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
