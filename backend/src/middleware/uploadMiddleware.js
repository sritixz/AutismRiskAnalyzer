import multer from "multer";
import fs from "fs";
import path from "path";

// Resolve uploads directory relative to project root (backend/uploads)
const UPLOAD_DIR = path.join(process.cwd(), "uploads", "screenings");

// Ensure the target directory exists before multer tries to write to it
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Accept only MP4/MOV — checked by both extension and reported MIME type
const ALLOWED_MIME_TYPES = ["video/mp4", "video/quicktime"];
const ALLOWED_EXTENSIONS = [".mp4", ".mov"];

// Cap file size to protect server memory/disk (250MB)
const MAX_FILE_SIZE_BYTES = 250 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${req.user?.id || "anonymous"}-${Date.now()}${ext}`;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
  const extOk = ALLOWED_EXTENSIONS.includes(ext);

  if (mimeOk && extOk) {
    return cb(null, true);
  }

  return cb(
    new Error("Invalid file type. Only MP4 and MOV videos are accepted."),
    false
  );
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
});

/**
 * Wraps multer's single-file upload to produce consistent JSON error
 * responses instead of letting multer throw raw errors past Express.
 */
const handleVideoUpload = (req, res, next) => {
  const singleUpload = upload.single("video");

  singleUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          success: false,
          message: "Video file is too large. Maximum allowed size is 250MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    }

    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No video file was provided.",
      });
    }

    next();
  });
};

export { handleVideoUpload, UPLOAD_DIR };
