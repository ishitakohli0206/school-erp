import { useEffect, useState } from "react";
import { getTeacherStudents } from "../../services/teacherAPI";
import MainLayout from "../../components/MainLayout";
import "../Students.css";

const StudentsList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getTeacherStudents()
      .then((res) => {
        if (isMounted) {
          setStudents(res.data || []);
        }
      })
      .catch((err) => {
        console.error("Error fetching teacher students", err);
        if (isMounted) {
          setError("Failed to load students. Please try again.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <MainLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">My Students</h1>
          <p className="page-subtitle">Students assigned to your class</p>
        </div>

        <div className="card">
          {loading && <p>Loading students...</p>}
          {error && <p className="error-text">{error}</p>}

          {!loading && !error && (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Class</th>
                    <th>Section</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-row">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students.map((s) => (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.User?.name || "-"}</td>
                        <td>{s.User?.email || "-"}</td>
                        <td>{s.Class?.class_name || "-"}</td>
                        <td>{s.Class?.section || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentsList;
