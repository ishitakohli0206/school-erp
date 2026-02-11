import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import AdminDashboard from "../pages/AdminDashboard";
import Students from "../pages/Students";
import Attendance from "../pages/Attendance";
import StudentDashboard from "../pages/StudentDashboard";
import ParentDashboard from "../pages/parent/ParentDashboard";
import ParentAttendance from "../pages/parent/ParentAttendance";
import ParentNotifications from "../pages/parent/parentNotifications";
import ParentAcademics from "../pages/parent/ParentAcademics";
import TeacherDashboard from "../pages/Teacher/TeacherDashboard";
import TeacherClasses from "../pages/Teacher/TeacherClasses";
import StudentList from "../pages/Teacher/StudentList";
import TeacherAcademics from "../pages/Teacher/TeacherAcademics";
import Reports from "../pages/Reports";
import AdminERP from "../pages/AdminERP";
import StudentAcademics from "../pages/StudentAcademics";
import ProtectedRoute from "../components/ProtectedRoute";
import PublicWebsite from "../pages/PublicWebsite";
import AdminOperations from "../pages/AdminOperations";
import StudentProfile from "../pages/StudentProfile";
import ParentProfile from "../pages/parent/ParentProfile";
import TeacherCommunication from "../pages/Teacher/TeacherCommunication";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<PublicWebsite />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/erp"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminERP />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/operations"
        element={
          <ProtectedRoute allowedRoles={[1]}>
            <AdminOperations />
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
      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRoles={[1, 2, 4]}>
            <Attendance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/academics"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <StudentAcademics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={[2]}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/classes"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <TeacherClasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <StudentList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance/view"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/academics"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <TeacherAcademics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/communication"
        element={
          <ProtectedRoute allowedRoles={[4]}>
            <TeacherCommunication />
          </ProtectedRoute>
        }
      />

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
      <Route
        path="/parent/academics"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <ParentAcademics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/profile"
        element={
          <ProtectedRoute allowedRoles={[3]}>
            <ParentProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
