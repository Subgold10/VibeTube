import multer from "multer";
import path from "path";

// Custom storage configuration
const customStorage = multer.diskStorage({
  destination(request, file, done) {
    done(null, "uploads/"); // Save in upload folder
  },
  filename(request, file, done) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + ext;
    done(null, uniqueName);
  },
});

// Validate file type function
const validateFileType = (request, file, done) => {
  console.log("Validating file:", file.originalname, file.mimetype);
  const isAccepted =
    file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");
  if (isAccepted) {
    console.log("File accepted:", file.originalname);
    done(null, true);
  } else {
    console.log("File rejected:", file.originalname, file.mimetype);
    done(new Error("Only image and video files are allowed."), false);
  }
};

// Multer upload configuration
const mediaUploader = multer({
  storage: customStorage,
  fileFilter: validateFileType,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// Exporting middleware to handle upload
export const uploadFiles = mediaUploader.fields([
  { name: "imgFile", maxCount: 1 },
  { name: "videoFile", maxCount: 1 },
]);

// Error handling middleware for multer
export const handleMulterError = (error, request, response, nextHandler) => {
  if (error instanceof multer.MulterError) {
    console.log("Multer error:", error);
    if (error.code === "LIMIT_FILE_SIZE") {
      return response
        .status(400)
        .json({ error: "File too large. Maximum size is 100MB." });
    }
    return response
      .status(400)
      .json({ error: "File upload error: " + error.message });
  } else if (error) {
    console.log("File validation error:", error);
    return response.status(400).json({ error: error.message });
  }
  nextHandler();
};

export default uploadFiles;
