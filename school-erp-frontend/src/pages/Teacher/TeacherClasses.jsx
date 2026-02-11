import { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import { getTeacherClasses } from "../../services/teacherAPI";

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await getTeacherClasses();
        setClasses(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load classes");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  return (
    <MainLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">My Classes</h1>
        </div>

        {loading && <p>Loading classes...</p>}
        {error && <p className="error-text">{error}</p>}

        {!loading && !error && (
          <div className="card">
            {classes.length === 0 ? (
              <p>No classes assigned.</p>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Class</th>
                    <th>Section</th>
                  </tr>
                </thead>
                <tbody>
                  {classes.map((cls) => (
                    <tr key={cls.id}>
                      <td>{cls.class_name}</td>
                      <td>{cls.section}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TeacherClasses;
