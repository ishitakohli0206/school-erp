import api from "./api";

// MARK attendance (admin / teacher)
export const markAttendance = (data) => {
  return api.post("/attendance/mark", data);
};

// STUDENT attendance
export const getStudentAttendance = (studentId) => {
  return api.get(`/attendance/student/${studentId}`);
};

// TEACHER attendance records (for their assigned class)
export const getTeacherAttendance = () => {
  return api.get("/attendance/teacher");
};
