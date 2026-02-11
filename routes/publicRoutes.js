const express = require("express");
const router = express.Router();
const { getPublicOverview, createAdmissionEnquiry } = require("../controllers/publicController");

router.get("/overview", getPublicOverview);
router.post("/admission-enquiry", createAdmissionEnquiry);

module.exports = router;
