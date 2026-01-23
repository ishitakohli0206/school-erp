import { useState } from "react";

const Attendance = () => {
  const role = localStorage.getItem("role");
  const [attendance, setAttendance] = useState([]);

  const markAttendance = (status) => {
    setAttendance([...attendance, status]);
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Attendance</h2>

      {(role === "admin" || role === "teacher") && (
        <>
          <button onClick={() => markAttendance("Present")}>
            Mark Present
          </button>
          <button onClick={() => markAttendance("Absent")}>
            Mark Absent
          </button>
        </>
      )}

      {role === "student" && (
        <p>You can only view your attendance.</p>
      )}

      <ul>
        {attendance.map((a, i) => (
          <li key={i}>{a}</li>
        ))}
      </ul>
    </div>
  );
};

export default Attendance;
