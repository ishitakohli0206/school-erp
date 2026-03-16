import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getQuizLinks } from "../services/erpService";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [attendancePercent, setAttendancePercent] = useState("0%");
  const [loading, setLoading] = useState(false);
  const [quizLinks, setQuizLinks] = useState([]);

  useEffect(() => {
    const studentId = localStorage.getItem("student_id");
    if (!studentId) return;

    setLoading(true);
    api
      .get(`/attendance/student/${studentId}`)
      .then((res) => {
        const records = res.data || [];
        if (!records.length) return setAttendancePercent("0%");
        const present = records.filter((record) => record.status === "present").length;
        setAttendancePercent(`${Math.round((present / records.length) * 100)}%`);
      })
      .catch(() => setAttendancePercent("0%"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    getQuizLinks()
      .then((res) => setQuizLinks(res.data || []))
      .catch(() => setQuizLinks([]));
  }, []);

  const stats = [
    { title: "Enrolled Classes", value: "1", icon: "CL", color: "#3b82f6" },
    { title: "Attendance", value: loading ? "..." : attendancePercent, icon: "AT", color: "#10b981", action: () => navigate("/attendance") },
    { title: "Assignments", value: "View", icon: "AS", color: "#f59e0b", action: () => navigate("/student/academics") },
    { title: "Results and Fees", value: "Open", icon: "RF", color: "#6366f1", action: () => navigate("/student/academics") }
  ];

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Student Dashboard</h1>
          <p className="dashboard-subtitle">Your attendance and academic overview</p>
        </div>

        <div className="dashboard-stats">
          {stats.map((stat) => (
            <div 
              key={stat.title} 
              className="stat-card"
              style={{ cursor: stat.action ? "pointer" : "default" }}
              onClick={stat.action}
            >
              <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>{stat.icon}</div>
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
                <button className="action-btn" onClick={() => navigate("/attendance")}>
                  <span className="action-icon">AT</span>
                  <span>Check Attendance</span>
                </button>
                <button className="action-btn" onClick={() => navigate("/student/academics")}>
                  <span className="action-icon">AC</span>
                  <span>Academics</span>
                </button>
                <button className="action-btn" onClick={() => navigate("/student/profile")}>
                  <span className="action-icon">PR</span>
                  <span>Profile</span>
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h2 className="card-title">Quiz Links</h2></div>
            <div className="card-body">
              {quizLinks.length === 0 ? (
                <p className="empty-state">No quizzes available right now.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {quizLinks.map((quiz) => (
                    <li key={quiz.id} style={{ padding: "10px 0", borderBottom: "1px solid #eef2f7" }}>
                      <a href={quiz.url} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                        {quiz.title}
                      </a>
                      <div style={{ fontSize: 13, color: "#6b7280" }}>
                        {new Date(quiz.created_at).toLocaleDateString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentDashboard;
