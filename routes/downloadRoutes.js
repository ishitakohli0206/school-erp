const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const os = require("os");

// Download file with proper headers
router.get("/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const uploadsDir = path.join(os.homedir(), "Desktop", "downloadsss");
    const filepath = path.join(uploadsDir, filename);

    // Prevent directory traversal attacks
    if (!filepath.startsWith(uploadsDir)) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Check if file exists
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: "File not found" });
    }

    // Set proper headers to force download with original filename
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");

    // Send file
    res.download(filepath);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Failed to download file" });
  }
});

module.exports = router;
