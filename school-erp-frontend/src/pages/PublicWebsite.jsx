import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicOverview, submitAdmissionEnquiry } from "../services/erpService";

const initialForm = {
  parent_name: "",
  email: "",
  phone: "",
  student_name: "",
  class_interested: "",
  message: ""
};

const PublicWebsite = () => {
  const [overview, setOverview] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getPublicOverview()
      .then((res) => setOverview(res.data))
      .catch(() => setOverview(null));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    try {
      await submitAdmissionEnquiry(form);
      setStatus("Admission enquiry submitted successfully.");
      setForm(initialForm);
    } catch (err) {
      setStatus(err.response?.data?.message || "Failed to submit admission enquiry");
    }
  };

  return (
    <div className="page-container" style={{ padding: "1.25rem" }}>
      <div className="card">
        <h1>{overview?.school?.name || "School Website + ERP"}</h1>
        <p>{overview?.school?.vision || "Vision and mission details"}</p>
        <p>{overview?.school?.mission || "Mission details"}</p>
        <p>
          Faculty: {overview?.highlights?.facultyCount ?? "-"} | Announcements: {overview?.highlights?.activeAnnouncements ?? "-"}
        </p>
        <p><Link to="/login">Login to ERP</Link></p>
      </div>

      <div className="card">
        <h2>About School & Infrastructure</h2>
        <p>Smart classrooms, science and computer labs, library, sports grounds and secure campus facilities.</p>
      </div>

      <div className="card">
        <h2>Courses / Classes Information</h2>
        <p>Primary, middle and senior secondary programs with activity-based and exam-focused learning.</p>
      </div>

      <div className="card">
        <h2>Faculty Overview</h2>
        <p>Experienced academic staff with class mentors and subject specialists.</p>
      </div>

      <div className="card">
        <h2>Events & Announcements</h2>
        <p>Annual events, exams, PTMs, competitions and circulars are published regularly.</p>
      </div>

      <div className="card">
        <h2>Photo Gallery</h2>
        <p>Campus and event photos can be integrated with your media store.</p>
      </div>

      <div className="card">
        <h2>Contact Us</h2>
        <p>Email: school@example.com | Phone: +91-XXXXXXXXXX</p>
      </div>

      <div className="card">
        <h2>Admission Enquiry</h2>
        {status && <p className="success-text">{status}</p>}
        <form className="form-grid" onSubmit={handleSubmit}>
          <input className="form-input" placeholder="Parent Name" value={form.parent_name} onChange={(e) => setForm({ ...form, parent_name: e.target.value })} />
          <input className="form-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="form-input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input className="form-input" placeholder="Student Name" value={form.student_name} onChange={(e) => setForm({ ...form, student_name: e.target.value })} />
          <input className="form-input" placeholder="Class Interested" value={form.class_interested} onChange={(e) => setForm({ ...form, class_interested: e.target.value })} />
          <input className="form-input" placeholder="Message (optional)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button className="btn-primary" type="submit">Submit Enquiry</button>
        </form>
      </div>
    </div>
  );
};

export default PublicWebsite;
