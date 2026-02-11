import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import Students from "../pages/Students";
import Attendance from "../pages/Attendance";
import StudentDashboard from "../pages/StudentDashboard";
import ParentDashboard from "../pages/parent/ParentDashboard";
import ParentAttendance from "../pages/parent/ParentAttendance";
import ParentNotifications from "../pages/parent/parentNotifications";
import TeacherDashboard from "../pages/Teacher/TeacherDashboard";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import Students from "../pages/Students";


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/students" element={<Students />} />
      <Route path="/attendance" element={<Attendance />} />

      <Route path="/student" element={<StudentDashboard />} />

      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      <Route path="/parent/attendance" element={<ParentAttendance />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route
       path="/parent/notifications"
       element={<ParentNotifications />}/>

      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      <Route path="/parent/attendance" element={<ParentAttendance />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
      <Route path="/students" element={<Students />} />
      <Route
       path="/parent/notifications"
       element={<ParentNotifications />}/>
    </Routes>
    
  );
};

export default AppRoutes;
