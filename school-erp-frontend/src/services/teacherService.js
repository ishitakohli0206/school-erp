import api from "./api";

export const getTeacherDashboardSummary = () => {
  return api.get("/teacher/dashboard-summary");
};