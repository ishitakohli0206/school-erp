const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const noticeController = require("../controllers/noticeController");

router.get("/", authMiddleware, noticeController.getNotices);
router.get("/admin/all", authMiddleware, noticeController.getAllNoticesForAdmin);
router.post("/", authMiddleware, noticeController.createNotice);

module.exports = router;
