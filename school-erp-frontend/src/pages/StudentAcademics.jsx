import { useEffect, useMemo, useState } from "react";
import MainLayout from "../components/MainLayout";
import { getAssignments, getExamConfigs, getFees, getNotices, getResults, payFee, getFeePayments } from "../services/erpService";

const StudentAcademics = () => {
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [examConfigs, setExamConfigs] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [assignmentRes, resultRes, feeRes, noticeRes, examRes, paymentsRes] = await Promise.all([
        getAssignments(),
        getResults(),
        getFees(),
        getNotices(),
        getExamConfigs(),
        getFeePayments()
      ]);
      setAssignments(assignmentRes.data || []);
      setResults(resultRes.data || []);
      setFees(feeRes.data || []);
      setNotices(noticeRes.data || []);
      setExamConfigs(examRes.data || []);
      setPayments(paymentsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load student modules");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const performance = useMemo(() => {
    if (!results.length) return 0;
    const totalPercent = results.reduce((acc, row) => acc + (Number(row.obtained_marks) / Number(row.max_marks)) * 100, 0);
    return Math.round(totalPercent / results.length);
  }, [results]);

  const feeDue = useMemo(
    () => fees.reduce((acc, row) => acc + Math.max(0, Number(row.amount_due) - Number(row.amount_paid)), 0),
    [fees]
  );

  const handlePayNow = async (fee) => {
    const due = Math.max(0, Number(fee.amount_due) - Number(fee.amount_paid));
    if (!due) return;
    try {
      setPaymentStatus("");
      await payFee({ fee_id: fee.id, amount: due, payment_method: "online" });
      setPaymentStatus(`Payment successful for ${fee.term}`);
      await load();
    } catch (err) {
      setPaymentStatus(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <MainLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Student Academic Portal</h1>
          <p className="page-subtitle">Results, assignments, fees and notices</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="stats-grid">
          <div className="stat-card"><h3>{assignments.length}</h3><p>Assignments</p></div>
          <div className="stat-card"><h3>{results.length}</h3><p>Result Entries</p></div>
          <div className="stat-card"><h3>{performance}%</h3><p>Avg Performance</p></div>
          <div className="stat-card"><h3>{feeDue.toFixed(2)}</h3><p>Fee Due</p></div>
        </div>

        <div className="card">
          <h2>Exam Results</h2>
          <table className="data-table">
            <thead><tr><th>Exam</th><th>Subject</th><th>Date</th><th>Marks</th></tr></thead>
            <tbody>
              {results.length === 0 ? (
                <tr><td colSpan="4">No results</td></tr>
              ) : (
                results.map((result) => (
                  <tr key={result.id}>
                    <td>{result.exam_name}</td>
                    <td>{result.Subject?.name || "-"}</td>
                    <td>{result.exam_date}</td>
                    <td>{result.obtained_marks}/{result.max_marks}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Homework / Assignments</h2>
          <table className="data-table">
            <thead><tr><th>Title</th><th>Description</th><th>Subject</th><th>Due Date</th><th>File</th></tr></thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr><td colSpan="5">No assignments</td></tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.title}</td>
                    <td>{assignment.description || "-"}</td>
                    <td>{assignment.Subject?.name || "-"}</td>
                    <td>{assignment.due_date}</td>
                    <td>
                      {assignment.file_path ? (
                        <a href={`/uploads/${assignment.file_path}`} download style={{ color: "#3b82f6", textDecoration: "underline" }}>
                          Download
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Fee Status & Payment History</h2>
          {paymentStatus && <p className="success-text">{paymentStatus}</p>}
          <table className="data-table">
            <thead><tr><th>Term</th><th>Due</th><th>Paid</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {fees.length === 0 ? (
                <tr><td colSpan="5">No fee records</td></tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee.id}>
                    <td>{fee.term}</td>
                    <td>{fee.amount_due}</td>
                    <td>{fee.amount_paid}</td>
                    <td>{fee.status}</td>
                    <td>
                      {Number(fee.amount_due) > Number(fee.amount_paid) ? (
                        <button className="btn-primary" onClick={() => handlePayNow(fee)}>Pay Now</button>
                      ) : (
                        "Paid"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div style={{ marginTop: 16 }}>
            <h3>Payment History</h3>
            <table className="data-table">
              <thead><tr><th>Receipt</th><th>Amount</th><th>Method</th><th>Date</th></tr></thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr><td colSpan="4">No payments found</td></tr>
                ) : (
                  payments.map((row) => (
                    <tr key={row.id}>
                      <td>{row.reference_no}</td>
                      <td>{row.amount}</td>
                      <td>{row.payment_method}</td>
                      <td>{row.paid_on}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2>Exam Schedule</h2>
          <table className="data-table">
            <thead><tr><th>Exam</th><th>Class</th><th>Start</th><th>End</th></tr></thead>
            <tbody>
              {examConfigs.length === 0 ? (
                <tr><td colSpan="4">No exam configurations</td></tr>
              ) : (
                examConfigs.map((exam) => (
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

        <div className="card">
          <h2>School Notices</h2>
          <table className="data-table">
            <thead><tr><th>Title</th><th>Message</th><th>Date</th><th>File</th></tr></thead>
            <tbody>
              {notices.length === 0 ? (
                <tr><td colSpan="4">No notices</td></tr>
              ) : (
                notices.map((notice) => (
                  <tr key={notice.id}>
                    <td>{notice.title}</td>
                    <td>{notice.message}</td>
                    <td>{new Date(notice.created_at).toLocaleDateString()}</td>
                    <td>
                      {notice.file_path ? (
                        <a href={`/uploads/${notice.file_path}`} download style={{ color: "#3b82f6", textDecoration: "underline" }}>
                          Download
                        </a>
                      ) : (
                        "-"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentAcademics;
