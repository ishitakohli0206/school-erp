import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ParentDashboard = () => {
  const navigate = useNavigate();
  const [parentName, setParentName] = useState("");

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (!name) {
      navigate("/login");
    } else {
      setParentName(name);
    }
  }, [navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Parent Dashboard</h2>
      <p>Welcome, <b>{parentName}</b></p>

      <hr />

      <button onClick={() => navigate("/parent/attendance")}>
        View Child Attendance
      </button>

      <br /><br />

      <button
        onClick={() => {
          localStorage.clear();
          navigate("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default ParentDashboard;
