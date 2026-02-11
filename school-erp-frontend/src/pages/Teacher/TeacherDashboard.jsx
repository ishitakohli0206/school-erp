import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/MainLayout";
import { useAuth } from "../../context/authContext";
import api from "../../services/api";
import "../Dashboard.css";

const TeacherDashboard = () => {
  const [data, setData] = useState({
    totalStudents: 0,
    totalClasses: 0,
    presentToday: 0,
    absentToday: 0
  });
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/teacher/dashboard-summary");
        setData(res.data);
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout(navigate);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [logout, navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Teacher Dashboard</h1>
          <p className="dashboard-subtitle">Overview of today's activity</p>
        </div>

        <div className="dashboard-stats">
          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/teacher/students")}
          >
            <h3 className="stat-value">{data.totalStudents}</h3>
            <p className="stat-title">Students</p>
          </div>

          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/teacher/classes")}
          >
            <h3 className="stat-value">{data.totalClasses}</h3>
            <p className="stat-title">Classes</p>
          </div>

          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/teacher/attendance/view?type=present")}
          >
            <h3 className="stat-value">{data.presentToday}</h3>
            <p className="stat-title">Present Today</p>
          </div>

          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/teacher/attendance/view?type=absent")}
          >
            <h3 className="stat-value">{data.absentToday}</h3>
            <p className="stat-title">Absent Today</p>
          </div>
        </div>

        <div className="dashboard-content">
          <button
            className="action-btn"
            onClick={() => navigate("/teacher/attendance")}
          >
            Mark Attendance
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/teacher/academics")}
            style={{ marginLeft: "12px" }}
          >
            Homework and Results
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/teacher/communication")}
            style={{ marginLeft: "12px" }}
          >
            Parent Communication
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeacherDashboard;
