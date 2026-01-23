import LogoutButton from "../components/LogoutButton";

const AdminDashboard = () => {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>
      <p>Only admins can see this</p>

      <LogoutButton />
    </div>
  );
};

export default AdminDashboard;
