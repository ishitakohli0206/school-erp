import React from "react";
import MainLayout from "../components/MainLayout";
import "./Dashboard.css";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const stats = [
    { title: "Total Students", value: "—", icon: "👥", color: "#3b82f6" },
    { title: "Total Classes", value: "—", icon: "📚", color: "#10b981" },

    
    {
      title: "Today's Attendance",
      value: "View",
      icon: "✓",
      color: "#f59e0b",
      action: () => navigate("/reports")
    },

    { title: "Pending Tasks", value: "—", icon: "📋", color: "#ef4444" }
  ];

  const recentActivities = [
    { id: 1, activity: "Attendance module active", time: "Today" },
    { id: 2, activity: "Admin logged in", time: "Just now" }
  ];

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p>Welcome, {user.name}</p>
          <p className="dashboard-subtitle">
            Overview of school operations and attendance insights
          </p>
        </div>

        <div className="dashboard-stats">
          {stats.map((stat) => (
            <div
              key={stat.title}
              className="stat-card"
              style={{ cursor: stat.action ? "pointer" : "default" }}
              onClick={stat.action}
            >
              <div
                className="stat-icon"
                style={{
                  backgroundColor: `${stat.color}15`,
                  color: stat.color
                }}
              >
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
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div className="card-body">
              <div className="quick-actions">
                <button className="action-btn" onClick={() => navigate("/students")}>
                  <span className="action-icon">➕</span>
                  <span>Add Student</span>
                </button>

                <button className="action-btn" onClick={() => navigate("/attendance")}>
                  <span className="action-icon">📝</span>
                  <span>Take Attendance</span>
                </button>

                <button className="action-btn" onClick={() => navigate("/reports")}>
                  <span className="action-icon">📊</span>
                  <span>Class attendance</span>
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Recent Activity</h2>
            </div>
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
