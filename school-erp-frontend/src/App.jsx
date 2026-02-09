import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import ProtectedRoute from "./components/ProtectedRoute";
import ParentDashboard from "./pages/parent/ParentDashboard";
import ParentAttendance from "./pages/parent/ParentAttendance";
import ParentNotifications from "./pages/parent/parentNotifications";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import Unauthorized from "./pages/Unauthorized";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Students />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* STUDENT */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRoles={[1, 2]}>
            <Attendance />
          </ProtectedRoute>
        }
      />

      {/* PARENT */}
      <Route
        path="/parent/dashboard"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/parent/attendance"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <ParentAttendance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/parent/notifications"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <ParentNotifications />
          </ProtectedRoute>
        }
      />

      {/* TEACHER */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;