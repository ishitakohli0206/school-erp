import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/MainLayout";
import { useAuth } from "../../context/authContext";
import api from "../../services/api";
import { createQuizLink, getNotices, getQuizLinks } from "../../services/erpService";
import "../Dashboard.css";

const TeacherDashboard = () => {
  const [data, setData] = useState({
    totalStudents: 0,
    totalClasses: 0,
    presentToday: 0,
    absentToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [quizLinks, setQuizLinks] = useState([]);
  const [quizForm, setQuizForm] = useState({ title: "", url: "" });
  const [quizStatus, setQuizStatus] = useState("");
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/teacher/dashboard-summary");
        setData(res.data);
        // load recent notices
        try {
          const n = await getNotices();
          setNotices(n.data || []);
        } catch (err) {
          console.warn("Failed to load notices for teacher dashboard", err);
        }

        try {
          const quizRes = await getQuizLinks();
          setQuizLinks(quizRes.data || []);
        } catch (err) {
          console.warn("Failed to load quiz links for teacher dashboard", err);
        }
      } catch (err) {
        console.error(err);
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout(navigate);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [logout, navigate]);

  if (loading) return <div>Loading...</div>;

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setQuizStatus("");

    if (!quizForm.title.trim() || !quizForm.url.trim()) {
      setQuizStatus("Title and Form URL are required.");
      return;
    }

    setSubmittingQuiz(true);
    try {
      const res = await createQuizLink({
        title: quizForm.title.trim(),
        url: quizForm.url.trim()
      });

      setQuizLinks((prev) => [res.data, ...prev]);
      setQuizForm({ title: "", url: "" });
      setQuizStatus("Quiz link added successfully.");
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;
      const message =
        (data && typeof data === "object" && data.message) ||
        (typeof data === "string" ? data : null) ||
        err.message ||
        "Failed to add quiz link.";
      setQuizStatus(status ? `(${status}) ${message}` : message);
    } finally {
      setSubmittingQuiz(false);
    }
  };

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Teacher Dashboard</h1>
          <p className="dashboard-subtitle">Overview of today's activity</p>
        </div>

        <div className="dashboard-stats">
          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/teacher/students")}
          >
            <h3 className="stat-value">{data.totalStudents}</h3>
            <p className="stat-title">Students</p>
          </div>

          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/teacher/classes")}
          >
            <h3 className="stat-value">{data.totalClasses}</h3>
            <p className="stat-title">Classes</p>
          </div>

          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/teacher/attendance/view?type=present")}
          >
            <h3 className="stat-value">{data.presentToday}</h3>
            <p className="stat-title">Present Today</p>
          </div>

          <div
            className="stat-card"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/teacher/attendance/view?type=absent")}
          >
            <h3 className="stat-value">{data.absentToday}</h3>
            <p className="stat-title">Absent Today</p>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="card-body">
              <div className="quick-actions">
                <button
                  className="action-btn"
                  onClick={() => navigate("/teacher/attendance")}
                >
                  Mark Attendance
                </button>

                <button
                  className="action-btn"
                  onClick={() => navigate("/teacher/academics")}
                >
                  Homework and Results
                </button>

                <button
                  className="action-btn"
                  onClick={() => navigate("/teacher/communication")}
                >
                  Parent Communication
                </button>
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h2 className="card-title">Quiz Links</h2></div>
            <div className="card-body">
              <form className="form-grid" onSubmit={handleQuizSubmit}>
                <input
                  className="form-input"
                  placeholder="Quiz title"
                  value={quizForm.title}
                  onChange={(e) => setQuizForm((prev) => ({ ...prev, title: e.target.value }))}
                />
                <input
                  className="form-input"
                  placeholder="Google or Microsoft Form URL"
                  value={quizForm.url}
                  onChange={(e) => setQuizForm((prev) => ({ ...prev, url: e.target.value }))}
                />
                <button className="action-btn" type="submit" disabled={submittingQuiz}>
                  {submittingQuiz ? "Adding..." : "Add Quiz Link"}
                </button>
              </form>
                   
              {quizStatus ? (
                <p style={{ marginTop: "10px", color: quizStatus.includes("successfully") ? "#16a34a" : "#dc2626" }}>
                  {quizStatus}
                </p>
              ) : null}
              <div style={{ marginTop: "14px" }}>
                {quizLinks.length === 0 ? (
                  <p className="empty-state" style={{ padding: "0.5rem 0" }}>No quiz links added yet.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {quizLinks.map((quiz) => (
                      <li key={quiz.id} style={{ padding: "8px 0", borderBottom: "1px solid #eef2f7" }}>
                        <a href={quiz.url} target="_blank" rel="noopener noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>
                          {quiz.title}
                        </a>
                        <div style={{ fontSize: 13, color: "#6b7280" }}>
                          {new Date(quiz.created_at).toLocaleDateString()}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h2 className="card-title">Recent Notices</h2></div>
            <div className="card-body">
              {notices.length === 0 ? (
                <p className="empty-state">No notices</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {notices.slice(0, 5).map((notice) => (
                    <li key={notice.id} style={{ padding: "8px 0", borderBottom: "1px solid #eef2f7" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ maxWidth: 480 }}>
                          <strong>{notice.title}</strong>
                          <div style={{ fontSize: 13, color: "#6b7280" }}>{new Date(notice.created_at).toLocaleDateString()}</div>
                          {notice.message && (
                            <div style={{ marginTop: 6, color: "#374151", fontSize: 14 }}>{notice.message}</div>
                          )}
                        </div>
                        <div>
                          {notice.file_path ? (
                            <a href={`/uploads/${notice.file_path}`} download style={{ color: "#3b82f6", textDecoration: "underline" }}>Download</a>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeacherDashboard;
