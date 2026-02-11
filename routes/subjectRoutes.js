const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const subjectController = require("../controllers/subjectController");

router.get("/", authMiddleware, subjectController.getSubjects);
router.post("/", authMiddleware, subjectController.createSubject);

module.exports = router;
