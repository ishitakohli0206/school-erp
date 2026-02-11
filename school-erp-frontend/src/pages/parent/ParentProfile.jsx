import { useEffect, useState } from "react";
import MainLayout from "../../components/MainLayout";
import { getFeePayments, getMyProfile, getParentChildren } from "../../services/erpService";

const ParentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [children, setChildren] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [profileRes, childrenRes, paymentRes] = await Promise.all([
          getMyProfile(),
          getParentChildren(),
          getFeePayments()
        ]);

        setProfile(profileRes.data || null);
        setChildren(childrenRes.data || []);
        setPayments(paymentRes.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load parent profile");
      }
    };
    load();
  }, []);

  return (
    <MainLayout>
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Parent Profile</h1>
          <p className="page-subtitle">Profile, linked children and payment receipts</p>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="card">
          <h2>Profile</h2>
          <p>Name: {profile?.user?.name || "-"}</p>
          <p>Email: {profile?.user?.email || "-"}</p>
          <p>Parent ID: {profile?.role_profile?.id || "-"}</p>
        </div>

        <div className="card">
          <h2>Linked Children</h2>
          <table className="data-table">
            <thead><tr><th>Student</th><th>Class</th></tr></thead>
            <tbody>
              {children.length === 0 ? (
                <tr><td colSpan="2">No linked children</td></tr>
              ) : (
                children.map((row) => (
                  <tr key={row.student_id}>
                    <td>{row.student_name}</td>
                    <td>{row.class_name || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h2>Fee Receipts</h2>
          <table className="data-table">
            <thead><tr><th>Receipt</th><th>Student</th><th>Amount</th><th>Date</th></tr></thead>
            <tbody>
              {payments.length === 0 ? (
                <tr><td colSpan="4">No payment history</td></tr>
              ) : (
                payments.map((row) => (
                  <tr key={row.id}>
                    <td>{row.reference_no}</td>
                    <td>{row.Student?.User?.name || "-"}</td>
                    <td>{row.amount}</td>
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

export default ParentProfile;
