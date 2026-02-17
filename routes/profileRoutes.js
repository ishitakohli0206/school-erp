const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { getMyProfile, uploadProfilePicture } = require("../controllers/profileController");

router.get("/me", authMiddleware, getMyProfile);
// Upload profile picture (accepts 'file' form field)
router.post("/photo", authMiddleware, (req, res, next) => {
	upload.single("file")(req, res, (err) => {
		if (err) return res.status(400).json({ message: err.message });
		next();
	});
}, uploadProfilePicture);

module.exports = router;
