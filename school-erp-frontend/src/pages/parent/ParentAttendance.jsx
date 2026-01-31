import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ParentAttendance = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    console.log("Fetching parent attendance with token:", token.substring(0, 20) + "...");

    axios
      .get("http://localhost:5000/parent/attendance", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Attendance data received:", res.data);
        setAttendance(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Attendance fetch error:");
        console.error("Status:", err.response?.status);
        console.error("Data:", err.response?.data);
        console.error("Message:", err.message);
        
        const errorMsg = err.response?.data?.message || 
                        err.response?.data?.detail ||
                        err.message || 
                        "Unable to fetch attendance";
        
        setError(errorMsg);
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Child Attendance</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && attendance.length === 0 && (
        <p>No attendance records found</p>
      )}

      {attendance.length > 0 && (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a) => (
              <tr key={a.id}>
                <td>{a.date}</td>
                <td>{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />
      <button onClick={() => navigate("/parent/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  );
};

export default ParentAttendance;
