import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import "../Dashboard.css";

const TeacherDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await api.get("/teacher/dashboard-summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (isMounted) {
          setData(res.data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Teacher dashboard error:", err);

        // Token expired / unauthorized
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout(navigate);
        } else {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [logout, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Teacher Dashboard</h1>
          <p className="dashboard-subtitle">
            Overview of today’s activity
          </p>
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