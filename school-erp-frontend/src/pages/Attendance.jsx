import { useState, useEffect } from "react";
import axios from "axios";
import { markAttendance } from "../services/attendanceService";

const Attendance = () => {
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");

  // FETCH STUDENTS (ADMIN)
  useEffect(() => {
    if (role === "admin") {
      axios
        .get("http://localhost:5000/api/students", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setStudents(res.data);
        })
        .catch((err) => {
          console.error("Error fetching students", err);
        });
    }
  }, [role, token]);

  // MARK ATTENDANCE
  const handleSubmit = async () => {
    if (!studentId || !date) {
      alert("Student and date required");
      return;
    }

    try {
      await markAttendance({
        student_id: studentId,
        date,
        status,
      });

      alert("Attendance marked successfully");
    } catch (err) {
      console.error(err);
      alert("Attendance mark failed");
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Attendance</h2>

      {(role === "admin" || role === "teacher") && (
        <>
          {/* STUDENT DROPDOWN */}
          <select
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
          >
            <option value="">Select Student</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.User?.name} — {s.Class?.class_name}
              </option>
            ))}
          </select>

          <br /><br />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <br /><br />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>

          <br /><br />

          <button onClick={handleSubmit}>Mark Attendance</button>
        </>
      )}

      {role === "student" && (
        <p>You can only view your attendance.</p>
      )}
    </div>
  );
};

export default Attendance;
