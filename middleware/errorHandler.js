// Middleware to handle multer errors
const handleMulterError = (err, req, res, next) => {
  if (err && err.message && err.message.includes("Invalid file type")) {
    return res.status(400).json({ message: err.message });
  }
  if (err && err.message && err.message.includes("File too large")) {
    return res.status(400).json({ message: "File size exceeds 10MB limit" });
  }
  if (err) {
    console.error("Multer error:", err);
    return res.status(400).json({ message: "File upload failed: " + err.message });
  }
  next();
};

module.exports = handleMulterError;
