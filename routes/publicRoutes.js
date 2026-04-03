const express = require("express");
const router = express.Router();
const { getPublicOverview, createAdmissionEnquiry, getGallery } = require("../controllers/publicController");

router.get("/overview", (req, res) => {
  res.json({
    students: 120,
    teachers: 15,
    classes: 8,
    attendance: "85%"
  });
});
router.post("/admission-enquiry", createAdmissionEnquiry);


module.exports = router;
