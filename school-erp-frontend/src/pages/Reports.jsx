import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import axios from "../services/api"; // same axios instance

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get("/attendance/summary");
        setSummary(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load reports");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <MainLayout><p>Loading reports...</p></MainLayout>;
  if (error) return <MainLayout><p className="error-text">{error}</p></MainLayout>;

  return (
    <MainLayout>
      <div className="page-container">
        <h1>Reports</h1>
        <p>Attendance overview and insights</p>

        <div className="stats-grid">
          <div className="stat-card">
            <h2>{summary.totalStudents}</h2>
            <p>Total Students</p>
          </div>

          <div className="stat-card">
            <h2>{summary.presentToday}</h2>
            <p>Present Today</p>
          </div>

          <div className="stat-card">
            <h2>{summary.absentToday}</h2>
            <p>Absent Today</p>
          </div>
        </div>

        <div className="card">
          <h2>Recent Attendance</h2>

          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentAttendance.length === 0 ? (
                <tr>
                  <td colSpan="3">No records</td>
                </tr>
              ) : (
                summary.recentAttendance.map((r) => (
                  <tr key={r.id}>
                    <td>{r.Student?.User?.name || "N/A"}</td>
                    <td>{r.date}</td>
                    <td>{r.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default Reports;
