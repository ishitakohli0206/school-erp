import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "../../components/MainLayout";
import "../Dashboard.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const ParentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showAlert, setShowAlert] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await api.get("/parent/attendance");
        const data = res.data || [];

        setAttendance(data);

        
        if (data.length > 0) {
          const sorted = [...data].sort(
            (a, b) => new Date(b.date) - new Date(a.date)
          );

          const latest = sorted[0];

          if (latest.status === "absent") {
            setShowAlert({
              title: "Attendance Alert",
              message: `Your child was absent on ${new Date(
                latest.date
              ).toLocaleDateString()}`
            });
          } else {
            setShowAlert(null);
          }
        }
      } catch (err) {
        console.error("Attendance fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const stats = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter(a => a.status === "present").length;
    const absent = attendance.filter(a => a.status === "absent").length;
    const avg = total ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, avg };
  }, [attendance]);

  const filteredAttendance = useMemo(() => {
    let data = [...attendance];

    if (statusFilter !== "all") {
      data = data.filter(a => a.status === statusFilter);
    }

    data.sort((a, b) => {
      const d1 = new Date(a.date);
      const d2 = new Date(b.date);
      return sortOrder === "desc" ? d2 - d1 : d1 - d2;
    });

    return data;
  }, [attendance, statusFilter, sortOrder]);

  return (
    <MainLayout>
      <div className="dashboard">

        {/* HEADER */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Child Attendance</h1>
          <p className="dashboard-subtitle">
            View and filter your child’s attendance records
          </p>
        </div>

        {/* 🔔 ALERT */}
        {showAlert && (
          <div className="notification-card">
            <strong>{showAlert.title}</strong>
            <p>{showAlert.message}</p>
          </div>
        )}

        {/* SUMMARY */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-content">
              <h3 className="stat-value">{stats.total}</h3>
              <p className="stat-title">Total Days</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <h3 className="stat-value">{stats.present}</h3>
              <p className="stat-title">Present</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <h3 className="stat-value">{stats.absent}</h3>
              <p className="stat-title">Absent</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-content">
              <h3 className="stat-value">{stats.avg}%</h3>
              <p className="stat-title">Average</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-card attendance-card">
            <div className="card-header">
              <h2 className="card-title">Attendance History</h2>
            </div>

            <div className="card-body">
              {!loading && (
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>

                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="desc">Latest first</option>
                    <option value="asc">Oldest first</option>
                  </select>
                </div>
              )}

              {loading ? (
                <p className="empty-state">Loading attendance...</p>
              ) : filteredAttendance.length === 0 ? (
                <p className="empty-state">No records found</p>
              ) : (
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((r) => (
                      <tr key={r.id}>
                        <td>{new Date(r.date).toLocaleDateString()}</td>
                        <td
                          style={{
                            color: r.status === "present" ? "#10b981" : "#ef4444",
                            fontWeight: 600
                          }}
                        >
                          {r.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

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