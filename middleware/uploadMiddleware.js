const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(os.homedir(), "Desktop", "downloadsss");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Keep the original filename
    cb(null, file.originalname);
  }
});

// File filter to allow only common document types
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/zip",
    "application/x-zip-compressed"
  ];

  const allowedExtensions = [
    ".pdf", ".doc", ".docx", ".xls", ".xlsx", 
    ".txt", ".jpg", ".jpeg", ".png", ".gif", ".webp",
    ".zip", ".pptx", ".ppt"
  ];

  const fileExt = path.extname(file.originalname).toLowerCase();
  const isMimeAllowed = allowedMimes.includes(file.mimetype);
  const isExtAllowed = allowedExtensions.includes(fileExt);

  // Allow file if either MIME type matches or extension matches
  if (isMimeAllowed || isExtAllowed) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Only PDF, Word, Excel, PowerPoint, images, text, and zip files are allowed. (File: ${file.originalname}, Type: ${file.mimetype})`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = upload;
