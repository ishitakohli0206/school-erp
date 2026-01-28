import { useEffect, useState } from "react";
import { getStudents } from "../services/studentService";
import MainLayout from "../components/MainLayout";
import "./Students.css";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    getStudents()
      .then((res) => {
        if (isMounted) {
          setStudents(res.data || []);
        }
      })
      .catch((err) => {
        console.error("Error fetching students", err);
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
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">List of registered students</p>
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
                    <th>User ID</th>
                    <th>Class ID</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="empty-row">
                        No students found
                      </td>
                    </tr>
                  ) : (
                    students.map((s) => (
                      <tr key={s.id}>
                        <td>{s.id}</td>
                        <td>{s.user_id}</td>
                        <td>{s.class_id}</td>
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

export default Students;
