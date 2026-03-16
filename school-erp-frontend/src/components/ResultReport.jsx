import { useMemo, useState } from "react";
import { jsPDF } from "jspdf";

// Helper function to calculate grade based on marks
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

const ResultReport = ({ results, studentInfo, schoolName = "SCHOOL NAME", session = "2024 - 2025" }) => {
  const [showReport, setShowReport] = useState(false);

  // Group results by student and calculate totals
  const processedData = useMemo(() => {
    if (!results || results.length === 0) return null;

    // Group by student
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

    // Calculate totals for each student
    const students = Array.from(studentMap.values()).map((student) => {
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
        
        return {
          ...subj,
          totalObtained: subjectTotal,
          totalMax: subjectMax,
          percentage: subjectMax > 0 ? Math.round((subjectTotal / subjectMax) * 100) : 0,
          grade: calculateGrade(subjectMax > 0 ? (subjectTotal / subjectMax) * 100 : 0)
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

    return students;
  }, [results]);

  const generatePDF = (studentData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // School Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(schoolName.toUpperCase(), pageWidth / 2, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Result", pageWidth / 2, 28, { align: "center" });
    
    // Student Info
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Marks Obtained ${studentData.totalObtained} / ${studentData.totalMax}`, 20, 40);
    doc.text(`Percentage ${studentData.overallPercentage}%`, 20, 46);
    doc.text(`Overall Grade ${studentData.overallGrade}`, 20, 52);
    
    doc.setFont("helvetica", "normal");
    doc.text("Class Teacher's Remark: -", 20, 60);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT ASSESSMENT REPORT", pageWidth / 2, 70, { align: "center" });
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Session : ${session}`, 20, 78);
    
    // Student Details
    doc.text(`STUDENT'S NAME ${studentData.studentName}`, 20, 86);
    doc.text(`CLASS ${studentData.className}`, 20, 92);
    doc.text(`SECTION ${studentData.section}`, 20, 98);
    
    // Table Header
    let yPos = 110;
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

  if (!processedData || processedData.length === 0) {
    return (
      <div className="card">
        <h2>Exam Results</h2>
        <p>No results available</p>
      </div>
    );
  }

  return (
    <div className="result-report">
      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2>Exam Results</h2>
          <button 
            className="btn-primary" 
            onClick={() => setShowReport(!showReport)}
          >
            {showReport ? "Hide Report" : "View Report"}
          </button>
        </div>

        {showReport && (
          <>
            {processedData.map((student) => (
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
            ))}
          </>
        )}

        {!showReport && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Exam</th>
                <th>Marks</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr key={result.id}>
                  <td>{result.Student?.User?.name || "-"}</td>
                  <td>{result.Student?.Class?.class_name || "-"} {result.Student?.Class?.section || ""}</td>
                  <td>{result.Subject?.name || "-"}</td>
                  <td>{result.exam_name}</td>
                  <td>{result.obtained_marks}/{result.max_marks}</td>
                  <td>{result.exam_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ResultReport;
