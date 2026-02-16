import { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import api from "../../services/api";
import "../Dashboard.css";

const ParentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/parent/notifications"), api.get("/notices")])
      .then(([n1, n2]) => {
        setNotifications(n1.data || []);
        setNotices(n2.data || []);
      })
      .catch(() => {
        setNotifications([]);
        setNotices([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Parent Notifications</h1>
          <p className="dashboard-subtitle">Alerts and school announcements</p>
        </div>

        <div className="dashboard-card">
          <div className="card-header"><h2 className="card-title">Attendance Alerts</h2></div>
          <div className="card-body">
            {loading ? (
              <p>Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="empty-state">No alerts available</p>
            ) : (
              <ul className="activity-list">
                {notifications.map((n) => (
                  <li key={n.id} className="activity-item">
                    <p className="activity-text"><strong>{n.title}</strong>: {n.message}</p>
                    <span className="activity-time">{n.created_at ? new Date(n.created_at).toLocaleDateString() : "-"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header"><h2 className="card-title">School Notices</h2></div>
          <div className="card-body">
            {loading ? (
              <p>Loading notices...</p>
            ) : notices.length === 0 ? (
              <p className="empty-state">No notices available</p>
            ) : (
              <ul className="activity-list">
                {notices.map((n) => (
                  <li key={n.id} className="activity-item">
                    <p className="activity-text"><strong>{n.title}</strong>: {n.message}</p>
                    {n.file_path && (
                      <p style={{ margin: "5px 0", fontSize: "0.9em" }}>
                        <a href={`/uploads/${n.file_path}`} download style={{ color: "#3b82f6", textDecoration: "underline" }}>
                          📎 Download Attachment
                        </a>
                      </p>
                    )}
                    <span className="activity-time">{new Date(n.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ParentNotifications;
