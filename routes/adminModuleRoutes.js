const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const adminModuleController = require("../controllers/adminModuleController");

router.use(authMiddleware);

router.get("/teachers", adminModuleController.getTeachers);
router.get("/parents", adminModuleController.getParents);
router.get("/admission-enquiries", adminModuleController.getAdmissionEnquiries);
router.get("/role-permissions", adminModuleController.getRolePermissions);
router.get("/exam-configs", adminModuleController.getExamConfigs);
router.post("/exam-configs", adminModuleController.createExamConfig);
router.get("/payroll", adminModuleController.getPayroll);
router.post("/payroll", adminModuleController.createPayroll);
router.get("/analytics", adminModuleController.getAnalytics);

module.exports = router;
