const express = require("express");
const router = express.Router();
const { getPublicOverview, createAdmissionEnquiry, getGallery } = require("../controllers/publicController");

router.get("/overview", getPublicOverview);
router.post("/admission-enquiry", createAdmissionEnquiry);
//router.get("/gallery", getGallery);

module.exports = router;
