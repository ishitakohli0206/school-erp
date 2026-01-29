import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import Students from "../pages/Students";
import Attendance from "../pages/Attendance";
import StudentDashboard from "../pages/StudentDashboard";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/attendance" element={<Attendance />} />

      <Route path="/student" element={<StudentDashboard />} />
    </Routes>
  );
};

export default AppRoutes;
