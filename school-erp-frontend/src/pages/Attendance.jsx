import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  markAttendance,
  getStudentAttendance,
  getTeacherAttendance
} from "../services/attendanceService";
import { getStudents } from "../services/studentService";
import { getTeacherStudents } from "../services/teacherAPI";
import MainLayout from "../components/MainLayout";
import "./Attendance.css";

const Attendance = () => {
  const location = useLocation();
  const queryType = new URLSearchParams(location.search).get("type");

  const role_id = Number(JSON.parse(localStorage.getItem("user"))?.role_id);
  const isTeacherAttendanceView =
    role_id === 4 && location.pathname === "/teacher/attendance/view";

  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("present");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [records, setRecords] = useState([]);
  const [recordsLoading, setRecordsLoading] = useState(false);
  const [recordsError, setRecordsError] = useState("");
  const [teacherRecords, setTeacherRecords] = useState([]);
  const [teacherRecordsLoading, setTeacherRecordsLoading] = useState(false);
  const [teacherRecordsError, setTeacherRecordsError] = useState("");

  useEffect(() => {
    console.log("Attendance mounted | role_id:", role_id);
  }, [role_id]);

  // ============================
  // FETCH STUDENTS (ADMIN + TEACHER)
  // ============================
  useEffect(() => {
    if (![1, 4].includes(role_id)) return;

    let mounted = true;
    setLoading(true);
    setError("");

    const fetchStudents = role_id === 4 ? getTeacherStudents : getStudents;

    fetchStudents()
      .then((res) => {
        if (mounted) setStudents(res.data || []);
      })
      .catch((err) => {
        if (mounted)
          setError(
            err.response?.data?.message || "Failed to load students"
          );
      })
      .finally(() => mounted && setLoading(false));

    return () => (mounted = false);
  }, [role_id]);

  // ============================
  // FETCH ATTENDANCE (STUDENT ONLY)
  // ============================
  useEffect(() => {
    if (role_id !== 2 ) return;

    const student_id = localStorage.getItem("student_id");
    if (!student_id) {
      setRecordsError("Student ID missing. Re-login required.");
      return;
    }

    setRecordsLoading(true);
    setRecordsError("");

    getStudentAttendance(student_id)
      .then((res) => setRecords(res.data || []))
      .catch((err) =>
        setRecordsError(
          err.response?.data?.message || "Failed to load attendance"
        )
      )
      .finally(() => setRecordsLoading(false));
  }, [role_id]);

  // ============================
  // FETCH TEACHER ATTENDANCE VIEW (REAL DB DATA)
  // ============================
  useEffect(() => {
    if (!isTeacherAttendanceView) return;

    setTeacherRecordsLoading(true);
    setTeacherRecordsError("");

    getTeacherAttendance()
      .then((res) => {
        const today = new Date().toISOString().split("T")[0];
        let rows = (res.data || []).filter((r) => r.date === today);

        if (queryType === "present" || queryType === "absent") {
          rows = rows.filter((r) => r.status === queryType);
        }

        setTeacherRecords(rows);
      })
      .catch((err) => {
        setTeacherRecordsError(
          err.response?.data?.message || "Failed to load teacher attendance"
        );
      })
      .finally(() => setTeacherRecordsLoading(false));
  }, [isTeacherAttendanceView, queryType]);

  // ============================
  // MARK ATTENDANCE (ADMIN + TEACHER)
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!studentId || !date) {
      setError("Student and date are required");
      return;
    }

    try {
      const res = await markAttendance({
        student_id: studentId,
        date,
        status,
      });

      setMessage(res.data?.message || "Attendance marked");
      setStudentId("");
      setDate("");
      setStatus("present");

      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to mark attendance");
    }
  };

  return (
    <MainLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">
            {[1, 4].includes(role_id)
              ? "Mark attendance for students"
              : "View your attendance records"}
          </p>
        </div>

        {/* ===== ADMIN + TEACHER ===== */}
        {[1, 4].includes(role_id) && (
          <div className="card">
            <h2 className="section-title">Mark Attendance</h2>

            {loading && <p>Loading students...</p>}
            {error && <p className="error-text">{error}</p>}
            {message && <p className="success-text">{message}</p>}

            {!loading && !error && (
              <form className="form-grid" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Student</label>
                  <select
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="form-input"
                  >
                    <option value="">Select Student</option>
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.User?.name || `Student ${s.id}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>

                <button type="submit" className="btn-primary">
                  Mark Attendance
                </button>
              </form>
            )}
          </div>
        )}

        {/* ===== TEACHER ATTENDANCE VIEW ===== */}
        {isTeacherAttendanceView && (
          <div className="card">
            <h2 className="section-title">
              {queryType === "present"
                ? "Present Today"
                : queryType === "absent"
                ? "Absent Today"
                : "Today's Attendance"}
            </h2>

            {teacherRecordsLoading && <p>Loading attendance...</p>}
            {teacherRecordsError && (
              <p className="error-text">{teacherRecordsError}</p>
            )}

            {!teacherRecordsLoading && !teacherRecordsError && (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Student Name</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherRecords.length === 0 ? (
                    <tr>
                      <td colSpan="3">No records found</td>
                    </tr>
                  ) : (
                    teacherRecords.map((r) => (
                      <tr key={r.id}>
                        <td>{r.date}</td>
                        <td>{r.Student?.User?.name || "-"}</td>
                        <td>{r.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ===== STUDENT ===== */}
        {role_id === 2 && (
          <div className="card">
            <h2 className="section-title">My Attendance</h2>

            {recordsLoading && <p>Loading attendance...</p>}
            {recordsError && <p className="error-text">{recordsError}</p>}

            {!recordsLoading && !recordsError && (
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
                      <td colSpan="2">No records found</td>
                    </tr>
                  ) : (
                    records.map((r) => (
                      <tr key={r.id}>
                        <td>{r.date}</td>
                        <td>{r.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Attendance;
