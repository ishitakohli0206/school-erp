import { useEffect, useState, useMemo } from "react";
import MainLayout from "../../components/MainLayout";
import api from "../../services/api";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import "../Dashboard.css";

const ParentDashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [children, setChildren] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [fees, setFees] = useState([]);

  useEffect(() => {
    api.get("/parent/my-children").then((res) => setChildren(res.data || [])).catch(() => setChildren([]));

    // fetch both parent-specific notifications and school notices (e.g. class suspended)
    Promise.all([api.get("/parent/notifications"), api.get("/notices")])
      .then(([n1, n2]) => {
        const pNotes = n1.data || [];
        const notices = n2.data || [];
        // merge and sort by created_at desc
        const merged = [...pNotes, ...notices].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setNotifications(merged);
      })
      .catch(() => setNotifications([]));

    // fetch fees for all linked children
    api.get("/fees")
      .then((res) => setFees(res.data || []))
      .catch(() => setFees([]));
  }, []);

  const totalDue = useMemo(
    () => fees.reduce((acc, fee) => acc + Math.max(0, Number(fee.amount_due) - Number(fee.amount_paid)), 0),
    [fees]
  );

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const firstChild = children[0];
  const stats = [
    { title: "Children", value: children.length || "-", icon: "CH", color: "#3b82f6" },
    { title: "Primary Child", value: firstChild?.student_name || "-", icon: "ST", color: "#10b981" },
    { title: "Attendance", value: "View", icon: "AT", color: "#f59e0b", action: () => navigate("/parent/attendance") },
    { title: "Total Fee Due", value: totalDue.toFixed(2), icon: "FE", color: "#ef4444" }
  ];

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Parent Dashboard</h1>
          <p>Welcome, {user.name}</p>
          <p className="dashboard-subtitle">Monitor your child academics and school updates</p>
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
                <button className="action-btn" onClick={() => navigate("/parent/attendance")}>
                  <span className="action-icon">AT</span>
                  <span>View Attendance</span>
                </button>
                <button className="action-btn" onClick={() => navigate("/parent/academics")}>
                  <span className="action-icon">AC</span>
                  <span>Results and Fees</span>
                </button>
                <button className="action-btn" onClick={() => navigate("/parent/notifications")}>
                  <span className="action-icon">NT</span>
                  <span>Notices</span>
                </button>
                <button className="action-btn" onClick={() => navigate("/parent/profile")}>
                  <span className="action-icon">PR</span>
                  <span>Profile and Receipts</span>
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h2 className="card-title">Recent Notifications</h2></div>
            <div className="card-body">
              {notifications.length === 0 ? (
                <p className="empty-state">No notifications available</p>
              ) : (
                <ul className="activity-list">
                  {notifications.slice(0, 5).map((n) => (
                    <li key={n.id} className="activity-item">
                      <p className="activity-text"><strong>{n.title}</strong>: {n.message}</p>
                      <span className="activity-time">{n.created_at ? new Date(n.created_at).toLocaleDateString() : "-"}</span>
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

export default ParentDashboard;
