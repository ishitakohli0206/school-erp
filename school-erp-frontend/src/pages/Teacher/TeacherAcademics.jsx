import { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import { createAssignment, getAssignments, getExamConfigs, getResults, getSubjects, saveResult } from "../../services/erpService";

const initialAssignment = { title: "", description: "", due_date: "", class_id: "", subject_id: "", file: null };
const initialResult = { student_id: "", subject_id: "", exam_name: "", max_marks: "100", obtained_marks: "", exam_date: "" };

const TeacherAcademics = () => {
  const [assignments, setAssignments] = useState([]);
  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [examConfigs, setExamConfigs] = useState([]);

  const [assignmentForm, setAssignmentForm] = useState(initialAssignment);
  const [resultForm, setResultForm] = useState(initialResult);
  const [status, setStatus] = useState("");

  const loadData = async () => {
    try {
      const [assignmentRes, resultRes, subjectRes, examRes] = await Promise.all([
        getAssignments(),
        getResults(),
        getSubjects(),
        getExamConfigs()
      ]);
      setAssignments(assignmentRes.data || []);
      setResults(resultRes.data || []);
      setSubjects(subjectRes.data || []);
      setExamConfigs(examRes.data || []);
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to load teacher modules");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAssignment = async (e) => {
    e.preventDefault();
    try {
      if (!assignmentForm.title.trim() || !assignmentForm.due_date || !assignmentForm.class_id) {
        setStatus("Title, due date and class are required");
        return;
      }

      const formData = new FormData();
      formData.append("title", assignmentForm.title);
      formData.append("description", assignmentForm.description);
      formData.append("due_date", assignmentForm.due_date);
      formData.append("class_id", Number(assignmentForm.class_id));
      if (assignmentForm.subject_id) {
        formData.append("subject_id", Number(assignmentForm.subject_id));
      }
      if (assignmentForm.file) {
        formData.append("file", assignmentForm.file);
      }

      const result = await createAssignment(formData);
      console.log("Assignment created:", result);
      setAssignmentForm(initialAssignment);
      setStatus("Assignment uploaded");
      loadData();
    } catch (error) {
      console.error("Assignment creation error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to upload assignment";
      setStatus(errorMsg);
    }
  };

  const handleResult = async (e) => {
    e.preventDefault();
    try {
      await saveResult({
        ...resultForm,
        student_id: Number(resultForm.student_id),
        subject_id: Number(resultForm.subject_id),
        max_marks: Number(resultForm.max_marks),
        obtained_marks: Number(resultForm.obtained_marks)
      });
      setResultForm(initialResult);
      setStatus("Result saved");
      loadData();
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to save result");
    }
  };

  return (
    <MainLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Faculty Academic Module</h1>
          <p className="page-subtitle">Assignments, exams and marks entry</p>
        </div>
        {status && <p className="success-text">{status}</p>}

        <div className="card">
          <h2>Upload Homework / Assignment</h2>
          <form className="form-grid" onSubmit={handleAssignment}>
            <input className="form-input" placeholder="Title" value={assignmentForm.title} onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })} required />
            <input className="form-input" placeholder="Description" value={assignmentForm.description} onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })} />
            <input className="form-input" type="date" value={assignmentForm.due_date} onChange={(e) => setAssignmentForm({ ...assignmentForm, due_date: e.target.value })} required />
            <input className="form-input" type="number" placeholder="Class ID" value={assignmentForm.class_id} onChange={(e) => setAssignmentForm({ ...assignmentForm, class_id: e.target.value })} required />
            <select className="form-input" value={assignmentForm.subject_id} onChange={(e) => setAssignmentForm({ ...assignmentForm, subject_id: e.target.value })}>
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
            <input className="form-input" type="file" onChange={(e) => setAssignmentForm({ ...assignmentForm, file: e.target.files?.[0] || null })} />
            <button className="btn-primary" type="submit">Upload</button>
          </form>
        </div>

        <div className="card">
          <h2>Exam Marks Entry</h2>
          <form className="form-grid" onSubmit={handleResult}>
            <input className="form-input" type="number" placeholder="Student ID" value={resultForm.student_id} onChange={(e) => setResultForm({ ...resultForm, student_id: e.target.value })} />
            <select className="form-input" value={resultForm.subject_id} onChange={(e) => setResultForm({ ...resultForm, subject_id: e.target.value })}>
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
            <input className="form-input" placeholder="Exam Name" value={resultForm.exam_name} onChange={(e) => setResultForm({ ...resultForm, exam_name: e.target.value })} />
            <input className="form-input" type="number" placeholder="Max Marks" value={resultForm.max_marks} onChange={(e) => setResultForm({ ...resultForm, max_marks: e.target.value })} />
            <input className="form-input" type="number" placeholder="Obtained Marks" value={resultForm.obtained_marks} onChange={(e) => setResultForm({ ...resultForm, obtained_marks: e.target.value })} />
            <input className="form-input" type="date" value={resultForm.exam_date} onChange={(e) => setResultForm({ ...resultForm, exam_date: e.target.value })} />
            <button className="btn-primary" type="submit">Save Marks</button>
          </form>
        </div>

        <div className="card">
          <h2>Assignments</h2>
          <table className="data-table">
            <thead><tr><th>Title</th><th>Description</th><th>Subject</th><th>Class</th><th>Due Date</th><th>File</th></tr></thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr><td colSpan="6">No assignments</td></tr>
              ) : (
                assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>{assignment.title}</td>
                    <td>{assignment.description || "-"}</td>
                    <td>{assignment.Subject?.name || "-"}</td>
                    <td>{assignment.Class?.class_name || "-"}</td>
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
          <h2>Exam Management (Configured Exams)</h2>
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
          <h2>Recent Results</h2>
          <table className="data-table">
            <thead><tr><th>Student</th><th>Exam</th><th>Subject</th><th>Marks</th></tr></thead>
            <tbody>
              {results.length === 0 ? (
                <tr><td colSpan="4">No results</td></tr>
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

        <div className="card">
          <h2>Student Performance Tracking</h2>
          <table className="data-table">
            <thead><tr><th>Student</th><th>Average %</th><th>Exams Count</th></tr></thead>
            <tbody>
              {Object.values(
                results.reduce((acc, row) => {
                  const key = row.Student?.id || `student-${row.id}`;
                  if (!acc[key]) {
                    acc[key] = {
                      key,
                      name: row.Student?.User?.name || "-",
                      total: 0,
                      count: 0
                    };
                  }
                  const percent = (Number(row.obtained_marks) / Number(row.max_marks)) * 100;
                  acc[key].total += percent;
                  acc[key].count += 1;
                  return acc;
                }, {})
              ).map((entry) => (
                <tr key={entry.key}>
                  <td>{entry.name}</td>
                  <td>{Math.round(entry.total / entry.count)}%</td>
                  <td>{entry.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeacherAcademics;
