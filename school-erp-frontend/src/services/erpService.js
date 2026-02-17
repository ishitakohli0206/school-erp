import api from "./api";

export const getAdminOverview = () => api.get("/erp/admin-overview");

export const createNotice = (data) => {
  // If data is FormData, don't set Content-Type header - axios handles it automatically
  return api.post("/notices", data);
};
export const getNotices = () => api.get("/notices");
export const getAllNotices = () => api.get("/notices/admin/all");

export const createAssignment = (data) => {
  // If data is FormData, don't set Content-Type header - axios handles it automatically
  return api.post("/assignments", data);
};
export const getAssignments = () => api.get("/assignments");

export const saveResult = (data) => api.post("/results", data);
export const getResults = () => api.get("/results");

export const saveFee = (data) => api.post("/fees", data);
export const getFees = () => api.get("/fees");
export const getFeeSummary = () => api.get("/fees/summary");

export const getSubjects = () => api.get("/subjects");
export const createSubject = (data) => api.post("/subjects", data);
export const createClass = (data) => api.post("/classes", data);

export const getParentChildren = () => api.get("/parent/my-children");
export const getParentAcademics = () => api.get("/parent/academics");

export const getTeachers = () => api.get("/admin/modules/teachers");
export const getParents = () => api.get("/admin/modules/parents");
export const getRolePermissions = () => api.get("/admin/modules/role-permissions");
export const getAdmissionEnquiries = () => api.get("/admin/modules/admission-enquiries");

export const getExamConfigs = () => api.get("/admin/modules/exam-configs");
export const createExamConfig = (data) => api.post("/admin/modules/exam-configs", data);

export const getPayroll = () => api.get("/admin/modules/payroll");
export const savePayroll = (data) => api.post("/admin/modules/payroll", data);

export const getAdminAnalytics = () => api.get("/admin/modules/analytics");

export const payFee = (data) => api.post("/fees/pay", data);
export const getFeePayments = () => api.get("/fees/payments");

export const sendParentUpdate = (data) => api.post("/teacher/parent-updates", data);

export const getMyProfile = () => api.get("/profile/me");
export const uploadProfilePicture = (formData) => api.post("/profile/photo", formData);

export const getPublicOverview = () => api.get("/public/overview");
export const submitAdmissionEnquiry = (data) => api.post("/public/admission-enquiry", data);
