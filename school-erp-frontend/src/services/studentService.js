import api from "./api";

export const getStudents = () => api.get("/api/students");
export const addStudent = (data) => api.post("/api/students/add", data);
