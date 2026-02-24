const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");


router.get("/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const uploadsDir = path.join(__dirname, "..", "uploads");
    const filepath = path.join(uploadsDir, filename);

   
    if (!filepath.startsWith(uploadsDir)) {
      return res.status(403).json({ message: "Access denied" });
    }

   
    if (!fs.existsSync(filepath)) {
      return res.status(404).json({ message: "File not found" });
    }

    const ext = path.extname(filename).toLowerCase();
    const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

    if (imageExts.includes(ext)) {
      let contentType = "application/octet-stream";
      if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      if (ext === ".png") contentType = "image/png";
      if (ext === ".gif") contentType = "image/gif";
      if (ext === ".webp") contentType = "image/webp";
      if (ext === ".svg") contentType = "image/svg+xml";

      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Disposition", `inline; filename="${filename}"`);
      return res.sendFile(filepath);
    }

 
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Type", "application/octet-stream");
    return res.download(filepath);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: "Failed to download file" });
  }
});

module.exports = router;
