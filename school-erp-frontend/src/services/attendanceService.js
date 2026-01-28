import api from "./api";

// MARK attendance (admin / teacher)
export const markAttendance = (data) => {
  return api.post("/attendance/mark", data);
};

// STUDENT attendance
export const getStudentAttendance = (studentId) => {
  return api.get(`/attendance/student/${studentId}`);
};
