import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import "../Dashboard.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const ParentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get("/parent/attendance");
        setAttendance(res.data || []);
      } catch (err) {
        console.error("Attendance fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  return (
    <MainLayout>
      <div className="dashboard">
        {/* HEADER */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Child Attendance</h1>
          <p className="dashboard-subtitle">
            Overview of your child’s attendance records
          </p>
        </div>

        {/* CONTENT */}
        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Attendance History</h2>
            </div>

            <div className="card-body">
              {loading ? (
                <p>Loading attendance...</p>
              ) : attendance.length === 0 ? (
                <p>No attendance records found</p>
              ) : (
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record) => (
                      <tr key={record.id}>
                        <td>{record.date}</td>
                        <td
                          style={{
                            color:
                              record.status === "present"
                                ? "#10b981"
                                : "#ef4444",
                            fontWeight: 500
                          }}
                        >
                          {record.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* ACTION CARD */}
          <div className="dashboard-card">
            <div className="card-body">
              <button
                className="action-btn"
                onClick={() => navigate("/parent/dashboard")}
              >
                ← Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ParentAttendance;
