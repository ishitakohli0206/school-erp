import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import axios from "../../services/api";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";


const ParentDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [child, setChild] = useState(null);

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const res = await axios.get("/parent/my-child");
        setChild(res.data);
      } catch (err) {
        console.error("Failed to fetch child data", err);
      }
    };

    fetchChild();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const stats = [
    {
      title: "Child Name",
      value: child?.student_name || "—",
      icon: "👤",
      color: "#3b82f6"
    },
    {
      title: "Class",
      value: child?.class_name || "—", 
      icon: "📚",
      color: "#10b981"
    },
    {
      title: "Attendance",
      value: "View",
      icon: "✓",
      color: "#f59e0b",
      action: () => navigate("/parent/attendance")
    },
    {
      title: "Status",
      value: "Active",
      icon: "📋",
      color: "#ef4444"
    }
  ];

  const recentActivities = [
    { id: 1, activity: "Attendance module available", time: "Today" },
    { id: 2, activity: "Parent logged in", time: "Just now" }
  ];

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Parent Dashboard</h1>
          <p>Welcome, {user.name}</p>
          <p className="dashboard-subtitle">
            Overview of your child’s academic information
          </p>
        </div>

        {/* STAT CARDS – EXACT SAME GRID & SPACING */}
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

        {/* CONTENT SECTION */}
        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Quick Actions</h2>
            </div>
            <div className="card-body">
              <div className="quick-actions">
                <button
                  className="action-btn"
                  onClick={() => navigate("/parent/attendance")}
                >
                  <span className="action-icon">📅</span>
                  <span>View Attendance</span>
                </button>

                <button className="action-btn" disabled>
                  <span className="action-icon">📊</span>
                  <span>Reports</span>
                </button>

                <button className="action-btn" disabled>
                  <span className="action-icon">✉️</span>
                  <span>Contact School</span>
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

export default ParentDashboard;
