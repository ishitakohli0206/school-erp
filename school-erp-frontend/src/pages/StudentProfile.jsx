import { useEffect, useState } from "react";
import MainLayout from "../components/MainLayout";
import { getFeePayments, getMyProfile } from "../services/erpService";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

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
          <p>Name: {profile?.user?.name || "-"}</p>
          <p>Email: {profile?.user?.email || "-"}</p>
          <p>Class: {profile?.role_profile?.Class?.class_name || "-"}</p>
          <p>Section: {profile?.role_profile?.Class?.section || "-"}</p>
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
