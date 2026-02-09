import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import api from "../../services/api";
import "../Dashboard.css";

const ParentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/parent/notifications");
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Notifications</h1>
          <p className="dashboard-subtitle">
            Important updates regarding your child
          </p>
        </div>

        <div className="dashboard-card">
          <div className="card-body">
            {loading ? (
              <p className="empty-state">Loading notifications...</p>
            ) : notifications.length === 0 ? (
              <p className="empty-state">No notifications available</p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "14px",
                    borderRadius: "10px",
                    marginBottom: "12px",
                    background: n.is_read ? "#f8fafc" : "#eef2ff",
                    borderLeft: "4px solid #2563eb"
                  }}
                >
                  <h4 style={{ margin: 0 }}>{n.title}</h4>
                  <p style={{ margin: "6px 0", color: "#374151" }}>
                    {n.message}
                  </p>
                  <small style={{ color: "#6b7280" }}>
                   <p className="notification-message">{n.message}</p>
                  </small>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ParentNotifications;