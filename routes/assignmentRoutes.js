const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const assignmentController = require("../controllers/assignmentController");

router.get("/", authMiddleware, assignmentController.getAssignmentsForCurrentUser);
router.post("/", authMiddleware, assignmentController.createAssignment);

module.exports = router;
