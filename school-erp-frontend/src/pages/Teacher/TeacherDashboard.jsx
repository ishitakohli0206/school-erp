import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

const TeacherDashboard = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/teacher/dashboard-summary");
      setData(res.data);
    };
    fetchData();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <MainLayout>
      <div className="dashboard">

        <div className="dashboard-header">
          <h1 className="dashboard-title">Teacher Dashboard</h1>
          <p className="dashboard-subtitle">Overview of today’s activity</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3 className="stat-value">{data.totalStudents}</h3>
            <p className="stat-title">Students</p>
          </div>

          <div className="stat-card">
            <h3 className="stat-value">{data.totalClasses}</h3>
            <p className="stat-title">Classes</p>
          </div>

          <div className="stat-card">
            <h3 className="stat-value">{data.presentToday}</h3>
            <p className="stat-title">Present Today</p>
          </div>

          <div className="stat-card">
            <h3 className="stat-value">{data.absentToday}</h3>
            <p className="stat-title">Absent Today</p>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="card-body">
              <button
                className="action-btn"
                onClick={() => navigate("/teacher/attendance")}
              >
                ➕ Mark Attendance
              </button>
            </div>
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default TeacherDashboard;