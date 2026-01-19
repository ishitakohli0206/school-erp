import { useNavigate } from "react-router-dom";
import { logout } from "../utils/logout";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(navigate);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <hr />

      <p>Welcome to School ERP</p>
    </div>
  );
};

export default Dashboard;
