import { useState, useEffect } from "react";
import { markAttendance, getStudentAttendance } from "../services/attendanceService";
import { getStudents } from "../services/studentService";
import MainLayout from "../components/MainLayout";
import "./Attendance.css";

const Attendance = () => {
  const role = localStorage.getItem("role");

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Present");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState("");

  // FETCH STUDENTS (ADMIN)
  useEffect(() => {
    if (role !== "admin") return;

    let isMounted = true;
    setLoading(true);

    getStudents()
      .then((res) => {
        if (isMounted) {
          setStudents(res.data || []);
        }
      })
      .catch((err) => {
        console.error("Error fetching students", err);
        if (isMounted) setError("Failed to load students.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [role]);

  // FETCH STUDENT ATTENDANCE (STUDENT ROLE)
  useEffect(() => {
    if (role !== "student") return;

    const storedStudentId = localStorage.getItem("student_id");
    
    if (!storedStudentId) {
      console.warn("Student ID not found in localStorage. Available keys:", Object.keys(localStorage));
      setRecordsError("Student ID not available. Please log out and log in again.");
      return;
    }

    console.log("Fetching attendance for student_id:", storedStudentId);
    setRecordsLoading(true);
    
    getStudentAttendance(storedStudentId)
      .then((res) => {
        console.log("Attendance records fetched:", res.data);
        setRecords(res.data || []);
        setRecordsError("");
      })
      .catch((err) => {
        console.error("Error fetching attendance:", err);
        setRecordsError(err.response?.data?.message || "Failed to load attendance records.");
      })
      .finally(() => setRecordsLoading(false));
  }, [role]);

  // MARK ATTENDANCE (ADMIN)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!studentId || !date) {
      setError("Student and date are required.");
      return;
    }

    try {
      const response = await markAttendance({
        student_id: studentId,
        date,
        status,
      });

      setMessage(response.data?.message || "Attendance marked successfully.");
      // Reset form
      setStudentId("");
      setDate("");
      setStatus("Present");
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Failed to mark attendance.";
      setError(errorMsg);
    }
  };

  return (
    <MainLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">
            {role === "admin"
              ? "Mark attendance for students"
              : "View your attendance records"}
          </p>
        </div>

        {role === "admin" && (
          <div className="card">
            <h2 className="section-title">Mark Attendance</h2>

            {loading && <p>Loading students...</p>}
            {error && <p className="error-text">{error}</p>}
            {message && <p className="success-text">{message}</p>}

            {!loading && !error && (
              <form className="form-grid" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="student">Student</label>
                  <select
                    id="student"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.User?.name || `Student ${s.id}`}{" "}
                        {s.Class?.class_name && `— ${s.Class.class_name}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Status</label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Mark Attendance
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {role === "student" && (
          <div className="card">
            <h2 className="section-title">My Attendance</h2>

            {recordsLoading && <p>Loading attendance...</p>}
            {recordsError && <p className="error-text">{recordsError}</p>}

            {!recordsLoading && !recordsError && (
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.length === 0 ? (
                      <tr>
                        <td colSpan="2" className="empty-row">
                          No attendance records found.
                        </td>
                      </tr>
                    ) : (
                      records.map((r) => (
                        <tr key={r.id || `${r.student_id}-${r.date}`}>
                          <td>{r.date}</td>
                          <td>{r.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Attendance;
