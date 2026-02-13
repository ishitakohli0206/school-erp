import { useEffect, useMemo, useState } from "react";
import MainLayout from "../components/MainLayout";
import {
  createClass,
  createExamConfig,
  getAdmissionEnquiries,
  getAdminAnalytics,
  getExamConfigs,
  getParents,
  getPayroll,
  getRolePermissions,
  getTeachers,
  savePayroll
} from "../services/erpService";

const initialClass = { class_name: "", section: "" };
const initialExam = { exam_name: "", class_id: "", start_date: "", end_date: "", grading_policy: "" };
const initialPayroll = { teacher_id: "", month: "", base_salary: "", deductions: "0", bonus: "0", status: "processed", paid_on: "" };

const AdminOperations = () => {
  const [teachers, setTeachers] = useState([]);
  const [parents, setParents] = useState([]);
  const [examConfigs, setExamConfigs] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [enquiries, setEnquiries] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [status, setStatus] = useState("");

  const [classForm, setClassForm] = useState(initialClass);
  const [examForm, setExamForm] = useState(initialExam);
  const [payrollForm, setPayrollForm] = useState(initialPayroll);

  const loadData = async () => {
    try {
      const [teacherRes, parentRes, examRes, payrollRes, permissionRes, enquiryRes, analyticsRes] = await Promise.all([
        getTeachers(),
        getParents(),
        getExamConfigs(),
        getPayroll(),
        getRolePermissions(),
        getAdmissionEnquiries(),
        getAdminAnalytics()
      ]);

      setTeachers(teacherRes.data || []);
      setParents(parentRes.data || []);
      setExamConfigs(examRes.data || []);
      setPayroll(payrollRes.data || []);
      setPermissions(permissionRes.data || {});
      setEnquiries(enquiryRes.data || []);
      setAnalytics(analyticsRes.data || null);
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to load admin operations data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalPayroll = useMemo(
    () => payroll.reduce((acc, row) => acc + Number(row.net_salary || 0), 0),
    [payroll]
  );

  const handleClassSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await createClass(classForm);
      setClassForm(initialClass);
      setStatus("Class created successfully");
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to create class");
    }
  };

  const handleExamSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await createExamConfig({
        ...examForm,
        class_id: Number(examForm.class_id)
      });
      setExamForm(initialExam);
      setStatus("Exam configuration saved");
      loadData();
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to save exam configuration");
    }
  };

  const handlePayrollSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await savePayroll({
        ...payrollForm,
        teacher_id: Number(payrollForm.teacher_id),
        base_salary: Number(payrollForm.base_salary),
        deductions: Number(payrollForm.deductions || 0),
        bonus: Number(payrollForm.bonus || 0)
      });
      setPayrollForm(initialPayroll);
      setStatus("Payroll saved successfully");
      loadData();
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to save payroll");
    }
  };

  return (
    <MainLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Admin Operations</h1>
          <p className="page-subtitle">Teachers, parents, class setup, exams, payroll, permissions and enquiries</p>
        </div>

        {status && <p className="success-text">{status}</p>}

        <div className="stats-grid">
          <div className="stat-card"><h3>{teachers.length}</h3><p>Teachers</p></div>
          <div className="stat-card"><h3>{parents.length}</h3><p>Parents</p></div>
          <div className="stat-card"><h3>{examConfigs.length}</h3><p>Exam Configs</p></div>
          <div className="stat-card"><h3>{totalPayroll.toFixed(2)}</h3><p>Total Payroll</p></div>
        </div>

        <div className="card">
          <h2>Class Setup</h2>
          <form className="form-grid" onSubmit={handleClassSubmit}>
            <input className="form-input" placeholder="Class Name" value={classForm.class_name} onChange={(e) => setClassForm({ ...classForm, class_name: e.target.value })} />
            <input className="form-input" placeholder="Section" value={classForm.section} onChange={(e) => setClassForm({ ...classForm, section: e.target.value })} />
            <button className="btn-primary" type="submit">Create Class</button>
          </form>
        </div>

        <div className="card">
          <h2>Exam Configuration</h2>
          <form className="form-grid" onSubmit={handleExamSubmit}>
            <input className="form-input" placeholder="Exam Name" value={examForm.exam_name} onChange={(e) => setExamForm({ ...examForm, exam_name: e.target.value })} />
            <input className="form-input" type="number" placeholder="Class ID" value={examForm.class_id} onChange={(e) => setExamForm({ ...examForm, class_id: e.target.value })} />
            <input className="form-input" type="date" value={examForm.start_date} onChange={(e) => setExamForm({ ...examForm, start_date: e.target.value })} />
            <input className="form-input" type="date" value={examForm.end_date} onChange={(e) => setExamForm({ ...examForm, end_date: e.target.value })} />
            <input className="form-input" placeholder="Grading Policy (optional)" value={examForm.grading_policy} onChange={(e) => setExamForm({ ...examForm, grading_policy: e.target.value })} />
            <button className="btn-primary" type="submit">Save Exam Config</button>
          </form>
        </div>

        <div className="card">
          <h2>Payroll Management</h2>
          <form className="form-grid" onSubmit={handlePayrollSubmit}>
            <select className="form-input" value={payrollForm.teacher_id} onChange={(e) => setPayrollForm({ ...payrollForm, teacher_id: e.target.value })} required>
              <option value="">Select Teacher</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (ID: {t.id})
                </option>
              ))}
            </select>
            <input className="form-input" type="month" value={payrollForm.month} onChange={(e) => setPayrollForm({ ...payrollForm, month: e.target.value })} required />
            <input className="form-input" type="number" placeholder="Base Salary" value={payrollForm.base_salary} onChange={(e) => setPayrollForm({ ...payrollForm, base_salary: e.target.value })} required />
            <input className="form-input" type="number" placeholder="Deductions" value={payrollForm.deductions} onChange={(e) => setPayrollForm({ ...payrollForm, deductions: e.target.value })} />
            <input className="form-input" type="number" placeholder="Bonus" value={payrollForm.bonus} onChange={(e) => setPayrollForm({ ...payrollForm, bonus: e.target.value })} />
            <select className="form-input" value={payrollForm.status} onChange={(e) => setPayrollForm({ ...payrollForm, status: e.target.value })} required>
              <option value="pending">Pending</option>
              <option value="processed">Processed</option>
              <option value="paid">Paid</option>
            </select>
            {payrollForm.status === "paid" && (
              <input className="form-input" type="date" value={payrollForm.paid_on} onChange={(e) => setPayrollForm({ ...payrollForm, paid_on: e.target.value })} placeholder="Paid On Date" />
            )}
            <div className="form-input" style={{ padding: "12px", backgroundColor: "#f0f0f0", borderRadius: "4px", display: "flex", alignItems: "center" }}>
              <strong>Net Salary: ₹{(Number(payrollForm.base_salary || 0) - Number(payrollForm.deductions || 0) + Number(payrollForm.bonus || 0)).toFixed(2)}</strong>
            </div>
            <button className="btn-primary" type="submit">Save Payroll</button>
          </form>

          <h3 style={{ marginTop: "40px", marginBottom: "20px" }}>Payroll Records</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Month</th>
                <th>Base Salary</th>
                <th>Deductions</th>
                <th>Bonus</th>
                <th>Net Salary</th>
                <th>Status</th>
                <th>Paid On</th>
              </tr>
            </thead>
            <tbody>
              {payroll.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "20px" }}>
                    No payroll records yet
                  </td>
                </tr>
              ) : (
                payroll.map((row) => (
                  <tr key={row.id}>
                    <td>{row.Teacher?.name || "Unknown"}</td>
                    <td>{row.month}</td>
                    <td>₹{Number(row.base_salary || 0).toFixed(2)}</td>
                    <td>₹{Number(row.deductions || 0).toFixed(2)}</td>
                    <td>₹{Number(row.bonus || 0).toFixed(2)}</td>
                    <td><strong>₹{Number(row.net_salary || 0).toFixed(2)}</strong></td>
                    <td>
                      <span style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "600",
                        backgroundColor: row.status === "paid" ? "#d4edda" : row.status === "processed" ? "#cfe2ff" : "#fff3cd",
                        color: row.status === "paid" ? "#155724" : row.status === "processed" ? "#004085" : "#856404"
                      }}>
                        {row.status}
                      </span>
                    </td>
                    <td>{row.paid_on ? new Date(row.paid_on).toLocaleDateString() : "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
            <p style={{ margin: "0 0 8px 0" }}><strong>Summary:</strong></p>
            <p style={{ margin: "4px 0" }}>Total Records: {payroll.length}</p>
            <p style={{ margin: "4px 0" }}>Total Net Payroll: <strong>₹{totalPayroll.toFixed(2)}</strong></p>
            <p style={{ margin: "4px 0" }}>Paid: {payroll.filter(p => p.status === "paid").length} | Processed: {payroll.filter(p => p.status === "processed").length} | Pending: {payroll.filter(p => p.status === "pending").length}</p>
          </div>
        </div>

        <div className="card">
          <h2>Teachers & Parents</h2>
          <p>Teachers: {teachers.map((t) => `${t.id}-${t.name}`).join(", ") || "None"}</p>
          <p>Parents: {parents.map((p) => `${p.id}-${p.User?.name || "-"}`).join(", ") || "None"}</p>
        </div>

      

        <div className="card">
          <h2>Admission Enquiries</h2>
          <table className="data-table">
            <thead><tr><th>Parent</th><th>Student</th><th>Class</th><th>Status</th><th>Date</th></tr></thead>
            <tbody>
              {enquiries.length === 0 ? (
                <tr><td colSpan="5">No enquiries</td></tr>
              ) : (
                enquiries.map((row) => (
                  <tr key={row.id}>
                    <td>{row.parent_name}</td>
                    <td>{row.student_name}</td>
                    <td>{row.class_interested}</td>
                    <td>{row.status}</td>
                    <td>{new Date(row.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Analytics</h2>
          <p>New Enquiries: {analytics?.newEnquiries ?? 0}</p>
          <p>Processed Payroll (This Month): {analytics?.processedPayrollThisMonth ?? 0}</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminOperations;
