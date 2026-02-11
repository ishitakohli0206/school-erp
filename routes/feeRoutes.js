const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const feeController = require("../controllers/feeController");

router.get("/", authMiddleware, feeController.getFeesForCurrentUser);
router.get("/summary", authMiddleware, feeController.getFeeSummary);
router.get("/payments", authMiddleware, feeController.getPaymentHistory);
router.post("/", authMiddleware, feeController.createOrUpdateFee);
router.post("/pay", authMiddleware, feeController.payFee);

module.exports = router;
