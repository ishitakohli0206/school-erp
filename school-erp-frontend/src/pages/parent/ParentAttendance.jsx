import { useEffect, useMemo, useState } from "react";
import MainLayout from "../../components/MainLayout";
import "../Dashboard.css";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const ParentAttendance = () => {
  const [children, setChildren] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/parent/my-children")
      .then((res) => {
        const list = res.data || [];
        setChildren(list);
        if (list.length) setSelectedStudentId(String(list[0].student_id));
      })
      .catch(() => setChildren([]));
  }, []);

  useEffect(() => {
    if (!selectedStudentId) return;
    setLoading(true);
    api.get(`/parent/attendance?student_id=${selectedStudentId}`)
      .then((res) => setAttendance(res.data || []))
      .catch(() => setAttendance([]))
      .finally(() => setLoading(false));
  }, [selectedStudentId]);

  const stats = useMemo(() => {
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const avg = total ? Math.round((present / total) * 100) : 0;
    return { total, present, absent, avg };
  }, [attendance]);

  const rows = useMemo(() => {
    if (statusFilter === "all") return attendance;
    return attendance.filter((row) => row.status === statusFilter);
  }, [attendance, statusFilter]);

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Child Attendance</h1>
          <p className="dashboard-subtitle">Track attendance by linked child</p>
        </div>

        <div className="dashboard-card">
          <div className="card-body" style={{ display: "flex", gap: "12px" }}>
            <select value={selectedStudentId} onChange={(e) => setSelectedStudentId(e.target.value)}>
              {children.map((child) => (
                <option key={child.student_id} value={child.student_id}>
                  {child.student_name} ({child.class_name || "Class"})
                </option>
              ))}
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card"><div className="stat-content"><h3 className="stat-value">{stats.total}</h3><p className="stat-title">Total</p></div></div>
          <div className="stat-card"><div className="stat-content"><h3 className="stat-value">{stats.present}</h3><p className="stat-title">Present</p></div></div>
          <div className="stat-card"><div className="stat-content"><h3 className="stat-value">{stats.absent}</h3><p className="stat-title">Absent</p></div></div>
          <div className="stat-card"><div className="stat-content"><h3 className="stat-value">{stats.avg}%</h3><p className="stat-title">Average</p></div></div>
        </div>

        <div className="dashboard-card">
          <div className="card-body">
            {loading ? (
              <p>Loading attendance...</p>
            ) : (
              <table className="data-table">
                <thead><tr><th>Date</th><th>Status</th></tr></thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr><td colSpan="2">No records found</td></tr>
                  ) : (
                    rows.map((row) => (
                      <tr key={row.id}>
                        <td>{new Date(row.date).toLocaleDateString()}</td>
                        <td>{row.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
            <button className="action-btn" onClick={() => navigate("/parent/dashboard")} style={{ marginTop: "12px" }}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ParentAttendance;
