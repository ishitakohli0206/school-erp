import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/Admin/Dashboard";
import Students from "../pages/Admin/Students";
import Attendance from "../pages/Admin/Attendance";
import StudentDashboard from "../pages/StudentDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/students" element={<Students />} />
      <Route path="/admin/attendance" element={<Attendance />} />

      <Route path="/student" element={<StudentDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
