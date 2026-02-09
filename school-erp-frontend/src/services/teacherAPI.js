import api from "./api";

export const getTeacherProfile = () => api.get("/teacher/me");
export const getTeacherClasses = () => api.get("/teacher/classes");
export const getTeacherStudents = () => api.get("/teacher/students");