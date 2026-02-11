const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const resultController = require("../controllers/resultController");

router.get("/", authMiddleware, resultController.getResultsForCurrentUser);
router.post("/", authMiddleware, resultController.upsertResult);

module.exports = router;
