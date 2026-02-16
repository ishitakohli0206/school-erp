import { useEffect, useMemo, useState } from "react";
import MainLayout from "../../components/MainLayout";
import { getExamConfigs, getFeePayments, getNotices, getParentAcademics } from "../../services/erpService";
import "../Dashboard.css";

const ParentAcademics = () => {
  const [children, setChildren] = useState([]);
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [examConfigs, setExamConfigs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [academicRes, noticesRes, examRes, paymentRes] = await Promise.all([
          getParentAcademics(),
          getNotices(),
          getExamConfigs(),
          getFeePayments()
        ]);
        setChildren(academicRes.data.children || []);
        setResults(academicRes.data.results || []);
        setFees(academicRes.data.fees || []);
        setAssignments(academicRes.data.assignments || []);
        setNotices(noticesRes.data || []);
        setExamConfigs(examRes.data || []);
        setPayments(paymentRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load parent academic data");
      }
    };
    loadData();
  }, []);

  const totalDue = useMemo(
    () => fees.reduce((acc, fee) => acc + Math.max(0, Number(fee.amount_due) - Number(fee.amount_paid)), 0),
    [fees]
  );

  return (
    <MainLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Parent Academic Overview</h1>
          <p className="dashboard-subtitle">Children performance, homework, fees and notices</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="dashboard-stats">
          <div className="stat-card"><div className="stat-content"><h3 className="stat-value">{children.length}</h3><p className="stat-title">Children Linked</p></div></div>
          <div className="stat-card"><div className="stat-content"><h3 className="stat-value">{results.length}</h3><p className="stat-title">Result Entries</p></div></div>
          <div className="stat-card"><div className="stat-content"><h3 className="stat-value">{assignments.length}</h3><p className="stat-title">Assignments</p></div></div>
          <div className="stat-card"><div className="stat-content"><h3 className="stat-value">{totalDue.toFixed(2)}</h3><p className="stat-title">Total Fee Due</p></div></div>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-card">
            <div className="card-header"><h2 className="card-title">Children</h2></div>
            <div className="card-body">
              <table className="data-table">
                <thead><tr><th>Student</th><th>Class</th><th>Section</th></tr></thead>
                <tbody>
                  {children.length === 0 ? (
                    <tr><td colSpan="3">No linked children</td></tr>
                  ) : (
                    children.map((child) => (
                      <tr key={child.student_id}>
                        <td>{child.student_name}</td>
                        <td>{child.class_name}</td>
                        <td>{child.section || "-"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h2 className="card-title">Results</h2></div>
            <div className="card-body">
              <table className="data-table">
                <thead><tr><th>Student</th><th>Exam</th><th>Subject</th><th>Marks</th></tr></thead>
                <tbody>
                  {results.length === 0 ? (
                    <tr><td colSpan="4">No result records</td></tr>
                  ) : (
                    results.map((result) => (
                      <tr key={result.id}>
                        <td>{result.Student?.User?.name || "-"}</td>
                        <td>{result.exam_name}</td>
                        <td>{result.Subject?.name || "-"}</td>
                        <td>{result.obtained_marks}/{result.max_marks}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h2 className="card-title">Fee Status & Payment History</h2></div>
            <div className="card-body">
              <p><strong>Fee Status</strong></p>
              <table className="data-table">
                <thead><tr><th>Student</th><th>Term</th><th>Due</th><th>Paid</th><th>Status</th></tr></thead>
                <tbody>
                  {fees.length === 0 ? (
                    <tr><td colSpan="5">No fee records</td></tr>
                  ) : (
                    fees.map((fee) => (
                      <tr key={fee.id}>
                        <td>{fee.Student?.User?.name || "-"}</td>
                        <td>{fee.term}</td>
                        <td>{fee.amount_due}</td>
                        <td>{fee.amount_paid}</td>
                        <td>{fee.status}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <p style={{ marginTop: "1rem" }}><strong>Payment History</strong></p>
              <table className="data-table">
                <thead><tr><th>Receipt</th><th>Student</th><th>Amount</th><th>Method</th><th>Date</th></tr></thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr><td colSpan="5">No payment history</td></tr>
                  ) : (
                    payments.map((row) => (
                      <tr key={row.id}>
                        <td>{row.reference_no}</td>
                        <td>{row.Student?.User?.name || "-"}</td>
                        <td>{row.amount}</td>
                        <td>{row.payment_method || "-"}</td>
                        <td>{row.paid_on}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h2 className="card-title">Assignments & Notices</h2></div>
            <div className="card-body">
              <p><strong>Assignments</strong></p>
              <ul className="activity-list">
                {assignments.slice(0, 5).map((assignment) => (
                  <li className="activity-item" key={assignment.id}>
                    <p className="activity-text"><strong>{assignment.title}</strong> ({assignment.Subject?.name || "General"})</p>
                    <p className="activity-text">{assignment.description || "No description"}</p>
                    <span className="activity-time">Due: {assignment.due_date}</span>
                  </li>
                ))}
              </ul>
              <p><strong>Notices</strong></p>
              <ul className="activity-list">
                {notices.slice(0, 5).map((notice) => (
                  <li className="activity-item" key={notice.id}>
                    <p className="activity-text">{notice.title}: {notice.message}</p>
                    <span className="activity-time">{new Date(notice.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header"><h2 className="card-title">Exam Schedule</h2></div>
            <div className="card-body">
              <table className="data-table">
                <thead><tr><th>Exam</th><th>Class</th><th>Start</th><th>End</th></tr></thead>
                <tbody>
                  {examConfigs.length === 0 ? (
                    <tr><td colSpan="4">No exam schedule</td></tr>
                  ) : (
                    examConfigs.slice(0, 5).map((exam) => (
                      <tr key={exam.id}>
                        <td>{exam.exam_name}</td>
                        <td>{exam.Class?.class_name || "-"}</td>
                        <td>{exam.start_date}</td>
                        <td>{exam.end_date}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ParentAcademics;
