import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import "./Dashboard.css";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { getAdminOverview } from "../services/erpService";

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    getAdminOverview()
      .then((res) => setOverview(res.data))
      .catch(() => setOverview(null));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const stats = [
    { title: "Total Students", value: overview?.totalStudents ?? "-", icon: "ST", color: "#3b82f6" },
    { title: "Total Classes", value: overview?.totalClasses ?? "-", icon: "CL", color: "#10b981" },
    { title: "Attendance", value: "View", icon: "AT", color: "#f59e0b", action: () => navigate("/reports") },
    { title: "Pending Fees", value: overview?.pendingFees ?? "-", icon: "FS", color: "#ef4444" }
  ];

  const recentActivities = [
    { id: 1, activity: "ERP modules synced", time: "Today" },
    { id: 2, activity: "Admin logged in", time: "Just now" }
  ];

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p>Welcome, {user.name}</p>
          <p className="dashboard-subtitle">Overview of school operations and ERP status</p>
        </div>

        <div className="dashboard-stats">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="stat-card"
              style={{ cursor: stat.action ? "pointer" : "default" }}
              onClick={stat.action}
            >
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                {stat.icon}
              </div>
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-title">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="card-header"><h2 className="card-title">Quick Actions</h2></div>
            <div className="card-body">
              <div className="quick-actions">
                <button className="action-btn" onClick={() => navigate("/students")}>
                  <span className="action-icon">+</span>
                  <span>Add Student</span>
                </button>
                <button className="action-btn" onClick={() => navigate("/attendance")}>
                  <span className="action-icon">A</span>
                  <span>Take Attendance</span>
                </button>
                <button className="action-btn" onClick={() => navigate("/reports")}>
                  <span className="action-icon">R</span>
                  <span>Attendance Reports</span>
                </button>
                <button className="action-btn" onClick={() => navigate("/admin/erp")}>
                  <span className="action-icon">E</span>
                  <span>ERP Modules</span>
                </button>
                <button className="action-btn" onClick={() => navigate("/admin/operations")}>
                  <span className="action-icon">OP</span>
                  <span>Operations</span>
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h2 className="card-title">Recent Activity</h2></div>
            <div className="card-body">
              <ul className="activity-list">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="activity-item">
                    <p className="activity-text">{activity.activity}</p>
                    <span className="activity-time">{activity.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;
