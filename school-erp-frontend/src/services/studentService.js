import api from "./api";

export const getStudents = () => api.get("/students");
export const addStudent = (data) => api.post("/students", data);
