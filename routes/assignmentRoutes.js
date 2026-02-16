const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const assignmentController = require("../controllers/assignmentController");

// Wrapper to handle multer errors
const handleUploadError = (req, res, next) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err.message);
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

router.get("/", authMiddleware, assignmentController.getAssignmentsForCurrentUser);
router.post("/", authMiddleware, handleUploadError, assignmentController.createAssignment);

module.exports = router;
