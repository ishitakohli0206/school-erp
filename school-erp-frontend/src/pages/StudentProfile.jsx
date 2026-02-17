import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { getFeePayments, getMyProfile } from "../services/erpService";
import { useRef } from "react";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileRes, paymentRes] = await Promise.all([
          getMyProfile(),
          getFeePayments()
        ]);
        setProfile(profileRes.data || null);
        setPayments(paymentRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load student profile");
      }
    };
    loadData();
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setUploading(true);
    try {
      const { uploadProfilePicture, getMyProfile } = await import("../services/erpService");
      await uploadProfilePicture(fd);
      const profileRes = await getMyProfile();
      setProfile(profileRes.data || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Student Profile</h1>
          <p className="page-subtitle">Profile details and fee receipts</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="card">
          <h2>Profile</h2>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <p>Name: {profile?.user?.name || "-"}</p>
              <p>Email: {profile?.user?.email || "-"}</p>
              <p>Class: {profile?.role_profile?.Class?.class_name || "-"}</p>
              <p>Section: {profile?.role_profile?.Class?.section || "-"}</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 120 }}>
              {profile?.role_profile?.profile_picture ? (
                <img src={`/uploads/${profile.role_profile.profile_picture}`} alt="Profile" style={{ width: 96, height: 96, objectFit: "cover", borderRadius: 8  }} />
              ) : (
                <div style={{ width: 96, height: 96, background: "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8 }}>No photo</div>
              )}
              <div style={{ marginTop: 8, textAlign: "center" }}>
                <label style={{ display: "block", marginBottom: 6, fontSize: 13 }}>Change profile picture (images only)</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => { handleUpload(e); setSelectedFileName(e.target.files?.[0]?.name || ""); }} style={{ display: "none" }} />
                  <button type="button" onClick={() => fileInputRef.current?.click()} style={{ padding: "6px 12px", borderRadius: 6, border: "1px solid #cbd5e1", background: "white", cursor: "pointer" }}>Choose File</button>
                  <span style={{ fontSize: 13, color: "#374151" }}>{selectedFileName || "No file chosen"}</span>
                </div>
                {uploading && <p style={{ fontSize: 12 }}>Uploading...</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h2>Fee Receipts / Payment History</h2>
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
    </MainLayout>
  );
};

export default StudentProfile;
