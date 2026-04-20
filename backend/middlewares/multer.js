import multer from "multer";

// Use in-memory storage to process files as Buffers
const storage = multer.memoryStorage();

// File type validation function
const fileFilter = (req, file, cb) => {
  // Accept only image files and PDF documents
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."), false);
  }
};

// ===== Multiple File Upload (e.g., profile photo + resume) =====
// Expects fields:
//   - profilePhoto (max 1 file)
//   - resume (max 1 file)
const multipleUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter,
}).fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

// ===== Single File Upload (e.g., logo image) =====
// Expects a single field: logo
const singleLogoUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB max
  fileFilter,
}).single("logo");

// ===== Optional: Single Upload for Resume Only (if needed) =====
const singleResumeUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter,
}).single("resume");

// Export all middlewares
export {
  multipleUpload,
  singleLogoUpload,
  singleResumeUpload,
};
