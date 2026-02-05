import React, { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import api from "../../services/api";

const ParentNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/parent/notifications")
      .then(res => setNotifications(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="dashboard">
        <h1 className="dashboard-title">Notifications</h1>

        {loading ? (
          <p className="empty-state">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="empty-state">No notifications</p>
        ) : (
          notifications.map(n => (
            <div key={n.id} className="dashboard-card" style={{ marginBottom: "1rem" }}>
              <div className="card-body">
                <h4>{n.title}</h4>
                <p>{n.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default ParentNotifications;