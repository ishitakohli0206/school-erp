const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getAdminOverview } = require("../controllers/erpController");

router.get("/admin-overview", authMiddleware, getAdminOverview);

module.exports = router;
