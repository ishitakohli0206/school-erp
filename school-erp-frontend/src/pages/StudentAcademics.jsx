import { useEffect, useMemo, useState } from "react";
import MainLayout from "../components/MainLayout";
import { getAssignments, getExamConfigs, getFees, getNotices, getResults, payFee, getFeePayments } from "../services/erpService";
import { jsPDF } from "jspdf";

// Helper function to calculate grade based on percentage
const calculateGrade = (percentage) => {
  if (percentage >= 91) return "A1";
  if (percentage >= 81) return "A2";
  if (percentage >= 71) return "B1";
  if (percentage >= 61) return "B2";
  if (percentage >= 51) return "C1";
  if (percentage >= 41) return "C2";
  if (percentage >= 33) return "D";
  return "E";
};

// Helper function to get grade color
const getGradeColor = (grade) => {
  const colors = {
    A1: "#1b5e20",
    A2: "#2e7d32",
    B1: "#388e3c",
    B2: "#4caf50",
    C1: "#f57c00",
    C2: "#fbaa00",
    D: "#e53935",
    E: "#d32f2f"
  };
  return colors[grade] || "#333";
};

const StudentAcademics = () => {
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notices, setNotices] = useState([]);
  const [examConfigs, setExamConfigs] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [error, setError] = useState("");
  const [showReport, setShowReport] = useState(false);

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

  // Process results for report view
  const processedResults = useMemo(() => {
    if (!results || results.length === 0) return [];

    const studentMap = new Map();
    
    results.forEach((result) => {
      const studentId = result.Student?.id || result.student_id;
      const studentName = result.Student?.User?.name || "Unknown";
      const className = result.Student?.Class?.class_name || "";
      const section = result.Student?.Class?.section || "";
      
      if (!studentMap.has(studentId)) {
        studentMap.set(studentId, {
          studentId,
          studentName,
          className,
          section,
          subjects: new Map()
        });
      }
      
      const studentData = studentMap.get(studentId);
      const subjectName = result.Subject?.name || "Unknown";
      
      if (!studentData.subjects.has(subjectName)) {
        studentData.subjects.set(subjectName, {
          subjectName,
          exams: []
        });
      }
      
      studentData.subjects.get(subjectName).exams.push({
        examName: result.exam_name,
        maxMarks: result.max_marks,
        obtainedMarks: result.obtained_marks,
        examDate: result.exam_date
      });
    });

    return Array.from(studentMap.values()).map((student) => {
      let totalObtained = 0;
      let totalMax = 0;
      
      const subjects = Array.from(student.subjects.values()).map((subj) => {
        let subjectTotal = 0;
        let subjectMax = 0;
        
        subj.exams.forEach((exam) => {
          subjectTotal += exam.obtainedMarks;
          subjectMax += exam.maxMarks;
        });
        
        totalObtained += subjectTotal;
        totalMax += subjectMax;
        
        const percentage = subjectMax > 0 ? Math.round((subjectTotal / subjectMax) * 100) : 0;
        
        return {
          ...subj,
          totalObtained: subjectTotal,
          totalMax: subjectMax,
          percentage,
          grade: calculateGrade(percentage)
        };
      });

      const overallPercentage = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
      
      return {
        ...student,
        subjects,
        totalObtained,
        totalMax,
        overallPercentage,
        overallGrade: calculateGrade(overallPercentage)
      };
    });
  }, [results]);

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

  const generatePDF = (studentData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // School Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("SUNRISE PUBLIC SCHOOL", pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("DABRI ROAD, VPO-SHERDA, TEH- BHADRA,", pageWidth / 2, 26, { align: "center" });
    doc.text("HANUMANGARH 335503 (RJ)", pageWidth / 2, 32, { align: "center" });
    doc.text("Contact No. - +91 97282 23456", pageWidth / 2, 38, { align: "center" });
    doc.text("Result", pageWidth / 2, 44, { align: "center" });
    
    // Student Info
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Marks Obtained ${studentData.totalObtained} / ${studentData.totalMax}`, 20, 54);
    doc.text(`Percentage ${studentData.overallPercentage}%`, 20, 60);
    doc.text(`Overall Grade ${studentData.overallGrade}`, 20, 66);
    
    doc.setFont("helvetica", "normal");
    doc.text("Class Teacher's Remark: -", 20, 74);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT ASSESSMENT REPORT", pageWidth / 2, 84, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Session : 2024 - 2025", 20, 92);
    
    // Student Details
    doc.text(`STUDENT'S NAME ${studentData.studentName}`, 20, 100);
    doc.text("FATHER'S NAME -", 20, 106);
    doc.text(`CLASS ${studentData.className}`, 20, 112);
    doc.text(`SECTION ${studentData.section}`, 80, 112);
    doc.text("ADM. NO. -", 20, 118);
    doc.text("ROLL NUMBER -", 80, 118);
    
    // Table Header
    let yPos = 130;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("SUBJECTS", 20, yPos);
    doc.text("MARKS OBTAINED", 80, yPos);
    doc.text("GRADE", 140, yPos);
    
    yPos += 6;
    doc.line(20, yPos, 190, yPos);
    yPos += 4;
    
    // Table Rows
    doc.setFont("helvetica", "normal");
    studentData.subjects.forEach((subject) => {
      doc.text(subject.subjectName, 20, yPos);
      doc.text(`${subject.totalObtained} / ${subject.totalMax}`, 80, yPos);
      doc.text(subject.grade, 140, yPos);
      yPos += 6;
    });
    
    // Total
    yPos += 4;
    doc.line(20, yPos, 190, yPos);
    yPos += 4;
    doc.setFont("helvetica", "bold");
    doc.text(`Grand Total ${studentData.totalObtained} / ${studentData.totalMax}`, 20, yPos);
    doc.text(`Percentage ${studentData.overallPercentage}%`, 80, yPos);
    doc.text(`Overall Grade ${studentData.overallGrade}`, 140, yPos);
    
    // Footer
    yPos += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("Class Teacher Sign", 20, yPos);
    doc.text("Exam Incharge Sign", 80, yPos);
    doc.text("Principal Sign", 140, yPos);
    
    // Save PDF
    doc.save(`${studentData.studentName}_Result.pdf`);
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2>Exam Results</h2>
            {results.length > 0 && (
              <button 
                className="btn-primary" 
                onClick={() => setShowReport(!showReport)}
              >
                {showReport ? "Hide Report" : "View Report"}
              </button>
            )}
          </div>

          {showReport && processedResults.length > 0 ? (
            processedResults.map((student) => (
              <div key={student.studentId} style={{ marginBottom: "2rem", border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{student.studentName}</h3>
                    <p style={{ margin: "4px 0", color: "#666" }}>
                      Class: {student.className} - Section: {student.section}
                    </p>
                  </div>
                  <button 
                    className="btn-primary" 
                    onClick={() => generatePDF(student)}
                    style={{ background: "#e53935" }}
                  >
                    Download PDF
                  </button>
                </div>
                
                <table className="data-table" style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Marks Obtained</th>
                      <th>Percentage</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.subjects.map((subject, idx) => (
                      <tr key={idx}>
                        <td>{subject.subjectName}</td>
                        <td>{subject.totalObtained} / {subject.totalMax}</td>
                        <td>{subject.percentage}%</td>
                        <td>
                          <span style={{ 
                            backgroundColor: getGradeColor(subject.grade),
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "4px",
                            fontSize: "12px"
                          }}>
                            {subject.grade}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr style={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
                      <td>Grand Total</td>
                      <td>{student.totalObtained} / {student.totalMax}</td>
                      <td>{student.overallPercentage}%</td>
                      <td>
                        <span style={{ 
                          backgroundColor: getGradeColor(student.overallGrade),
                          color: "white",
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}>
                          {student.overallGrade}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))
          ) : (
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
          )}
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
