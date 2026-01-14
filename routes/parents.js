const express = require("express");
const router = express.Router();

router.post("/link-student", async (req, res) => {
  res.json({ message: "Parent-Student link route working" });
});

module.exports = router;
