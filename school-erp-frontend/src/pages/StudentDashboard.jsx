import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import axios from "../services/api"; // same axios instance

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [attendancePercent, setAttendancePercent] = useState("0%");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const studentId = localStorage.getItem("student_id");

    if (!studentId) {
      console.error("student_id missing in localStorage");
      return;
    }

    setLoading(true);

    axios
      .get(`/attendance/student/${studentId}`)
      .then((res) => {
        const records = res.data || [];

        if (records.length === 0) {
          setAttendancePercent("0%");
          return;
        }

        const total = records.length;
        const present = records.filter(r => r.status === "present").length;

        const percent = Math.round((present / total) * 100);
        setAttendancePercent(`${percent}%`);
      })
      .catch((err) => {
        console.error("Attendance fetch error", err);
        setAttendancePercent("0%");
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { title: "Enrolled Classes", value: "1", icon: "📚", color: "#3b82f6" },
    {
      title: "Attendance This Month",
      value: loading ? "..." : attendancePercent,
      icon: "✓",
      color: "#10b981",
    },
    { title: "Pending Assignments", value: "0", icon: "📋", color: "#f59e0b" },
    { title: "Notifications", value: "0", icon: "🔔", color: "#6366f1" },
  ];

  const recentActivities = [
    { id: 1, activity: "Welcome to School ERP (Student)", time: "Today" },
  ];

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Student Dashboard</h1>
          <p className="dashboard-subtitle">
            View your classes, attendance and important updates
          </p>
        </div>

        <div className="dashboard-stats">
          {stats.map((stat) => (
            <div key={stat.title} className="stat-card">
              <div
                className="stat-icon"
                style={{
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
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
                <button className="action-btn">
                  <span className="action-icon">📅</span>
                  <span>View Timetable</span>
                </button>

                <button
                  className="action-btn"
                  onClick={() => navigate("/attendance")}
                >
                  <span className="action-icon">📝</span>
                  <span>Check Attendance</span>
                </button>

                <button className="action-btn">
                  <span className="action-icon">📄</span>
                  <span>Assignments</span>
                </button>

                <button className="action-btn">
                  <span className="action-icon">💬</span>
                  <span>Messages</span>
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
                    <div className="activity-content">
                      <p className="activity-text">{activity.activity}</p>
                      <span className="activity-time">{activity.time}</span>
                    </div>
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

export default StudentDashboard;
