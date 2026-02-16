import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import {
  createNotice,
  createSubject,
  getAdminOverview,
  getAllNotices,
  getFeeSummary,
  saveFee
} from "../services/erpService";

const initialNotice = { title: "", message: "", target_role: "all", class_id: "", file: null };
const initialFee = { student_id: "", term: "", amount_due: "", amount_paid: "", due_date: "" };
const initialSubject = { name: "", class_id: "", teacher_id: "" };

const AdminERP = () => {
  const [overview, setOverview] = useState(null);
  const [feeSummary, setFeeSummary] = useState(null);
  const [notices, setNotices] = useState([]);

  const [noticeForm, setNoticeForm] = useState(initialNotice);
  const [feeForm, setFeeForm] = useState(initialFee);
  const [subjectForm, setSubjectForm] = useState(initialSubject);

  const [status, setStatus] = useState("");

  const loadData = async () => {
    try {
      const [overviewRes, feeRes, noticeRes] = await Promise.all([
        getAdminOverview(),
        getFeeSummary(),
        getAllNotices()
      ]);
      setOverview(overviewRes.data);
      setFeeSummary(feeRes.data);
      setNotices(noticeRes.data || []);
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to load ERP admin data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      if (!noticeForm.title.trim() || !noticeForm.message.trim()) {
        setStatus("Title and message are required");
        return;
      }

      const formData = new FormData();
      formData.append("title", noticeForm.title);
      formData.append("message", noticeForm.message);
      formData.append("target_role", noticeForm.target_role);
      if (noticeForm.class_id) {
        formData.append("class_id", Number(noticeForm.class_id));
      }
      if (noticeForm.file) {
        formData.append("file", noticeForm.file);
      }

      const result = await createNotice(formData);
      console.log("Notice created:", result);
      setNoticeForm(initialNotice);
      setStatus("Notice created successfully");
      loadData();
    } catch (error) {
      console.error("Notice creation error:", error);
      const errorMsg = error.response?.data?.message || error.response?.data?.error || error.message || "Failed to create notice";
      setStatus(errorMsg);
    }
  };

  const handleFeeSave = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await saveFee({
        student_id: Number(feeForm.student_id),
        term: feeForm.term,
        amount_due: Number(feeForm.amount_due),
        amount_paid: Number(feeForm.amount_paid || 0),
        due_date: feeForm.due_date
      });
      setFeeForm(initialFee);
      setStatus("Fee data saved successfully");
      loadData();
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to save fee data");
    }
  };

  const handleSubjectSave = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await createSubject({
        name: subjectForm.name,
        class_id: Number(subjectForm.class_id),
        teacher_id: subjectForm.teacher_id ? Number(subjectForm.teacher_id) : null
      });
      setSubjectForm(initialSubject);
      setStatus("Subject created successfully");
    } catch (error) {
      setStatus(error.response?.data?.message || "Failed to create subject");
    }
  };

  return (
    <MainLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Admin ERP Modules</h1>
          <p className="page-subtitle">Notices, fees, subjects and analytics</p>
        </div>

        {status && <p className="success-text">{status}</p>}

        <div className="stats-grid">
          <div className="stat-card"><h3>{overview?.totalStudents || 0}</h3><p>Students</p></div>
          <div className="stat-card"><h3>{overview?.totalTeachers || 0}</h3><p>Teachers</p></div>
          <div className="stat-card"><h3>{overview?.totalClasses || 0}</h3><p>Classes</p></div>
          <div className="stat-card"><h3>{overview?.pendingFees || 0}</h3><p>Pending Fees</p></div>
        </div>

        <div className="card">
          <h2>Create Notice</h2>
          <form className="form-grid" onSubmit={handleCreateNotice}>
            <input className="form-input" placeholder="Title" value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} required />
            <input className="form-input" placeholder="Message" value={noticeForm.message} onChange={(e) => setNoticeForm({ ...noticeForm, message: e.target.value })} required />
            <select className="form-input" value={noticeForm.target_role} onChange={(e) => setNoticeForm({ ...noticeForm, target_role: e.target.value })}>
              <option value="all">All</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>
            <input className="form-input" type="number" placeholder="Class ID (optional)" value={noticeForm.class_id} onChange={(e) => setNoticeForm({ ...noticeForm, class_id: e.target.value })} />
            <input className="form-input" type="file" onChange={(e) => setNoticeForm({ ...noticeForm, file: e.target.files?.[0] || null })} />
            <button className="btn-primary" type="submit">Publish Notice</button>
          </form>
        </div>

        <div className="card">
          <h2>Fee Management</h2>
          <p>Total Due: {feeSummary?.totalDue || 0} | Total Paid: {feeSummary?.totalPaid || 0}</p>
          <form className="form-grid" onSubmit={handleFeeSave}>
            <input className="form-input" type="number" placeholder="Student ID" value={feeForm.student_id} onChange={(e) => setFeeForm({ ...feeForm, student_id: e.target.value })} />
            <input className="form-input" placeholder="Term (e.g., 2025-Q4)" value={feeForm.term} onChange={(e) => setFeeForm({ ...feeForm, term: e.target.value })} />
            <input className="form-input" type="number" placeholder="Amount Due" value={feeForm.amount_due} onChange={(e) => setFeeForm({ ...feeForm, amount_due: e.target.value })} />
            <input className="form-input" type="number" placeholder="Amount Paid" value={feeForm.amount_paid} onChange={(e) => setFeeForm({ ...feeForm, amount_paid: e.target.value })} />
            <input className="form-input" type="date" value={feeForm.due_date} onChange={(e) => setFeeForm({ ...feeForm, due_date: e.target.value })} />
            <button className="btn-primary" type="submit">Save Fee</button>
          </form>
        </div>

        <div className="card">
          <h2>Subject Setup</h2>
          <form className="form-grid" onSubmit={handleSubjectSave}>
            <input className="form-input" placeholder="Subject Name" value={subjectForm.name} onChange={(e) => setSubjectForm({ ...subjectForm, name: e.target.value })} />
            <input className="form-input" type="number" placeholder="Class ID" value={subjectForm.class_id} onChange={(e) => setSubjectForm({ ...subjectForm, class_id: e.target.value })} />
            <input className="form-input" type="number" placeholder="Teacher ID (optional)" value={subjectForm.teacher_id} onChange={(e) => setSubjectForm({ ...subjectForm, teacher_id: e.target.value })} />
            <button className="btn-primary" type="submit">Create Subject</button>
          </form>
        </div>

        <div className="card">
          <h2>Recent Notices</h2>
          <table className="data-table">
            <thead>
              <tr><th>Title</th><th>Role</th><th>Message</th><th>Date</th><th>File</th></tr>
            </thead>
            <tbody>
              {notices.length === 0 ? (
                <tr><td colSpan="5">No notices</td></tr>
              ) : (
                notices.map((notice) => (
                  <tr key={notice.id}>
                    <td>{notice.title}</td>
                    <td>{notice.target_role}</td>
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

export default AdminERP;
