import { useState } from "react";
import MainLayout from "../../components/MainLayout";
import { sendParentUpdate } from "../../services/erpService";

const initialForm = { title: "", message: "", student_id: "" };

const TeacherCommunication = () => {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await sendParentUpdate({
        title: form.title,
        message: form.message,
        student_id: form.student_id ? Number(form.student_id) : undefined
      });
      setStatus("Update sent successfully");
      setForm(initialForm);
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to send parent update");
    }
  };

  return (
    <MainLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Parent Communication</h1>
          <p className="page-subtitle">Send notice-based updates to parents</p>
        </div>

        {status && <p className="success-text">{status}</p>}

        <div className="card">
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="form-input" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            <input className="form-input" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <input className="form-input" type="number" placeholder="Student ID (optional)" value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} />
            <button className="btn-primary" type="submit">Send Update</button>
          </form>
          <p style={{ marginTop: "0.75rem" }}>
            Leave Student ID blank to notify all parents of your assigned class.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default TeacherCommunication;
