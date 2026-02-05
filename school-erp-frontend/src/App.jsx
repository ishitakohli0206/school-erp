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
import Unauthorized from "./pages/Unauthorized";



const App = () => {
  return (
    <Routes>

      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Students />
          </ProtectedRoute>
        }
      />

      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRoles={["admin","student"]}>
            <Attendance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
      path="/parent/dashboard"
      element={
       <ProtectedRoute allowedRoles={["parent"]}>
      <ParentDashboard />
      </ProtectedRoute>
      }
     />

     <Route
       path="/parent/attendance"
       element={
         <ProtectedRoute allowedRoles={["parent"]}>
        <ParentAttendance />
       </ProtectedRoute>
       }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      <Route path="/parent/attendance" element={<ParentAttendance />} />
      <Route path="/Unauthorized" element={<Unauthorized />} />

    </Routes>
    
  );
};

export default App;
