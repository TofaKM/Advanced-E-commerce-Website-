const multer = require("multer");
const { storage } = require("./cloudinary")
require("dotenv").config();

const multerInstance = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Optional: Only check for product_id during updates (PUT requests)
    if (req.method === 'PUT' && !req.body.product_id) {
      return cb(new Error('Product ID is required for updates'), false);
    }

    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, PNG, WebP)'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // Max 5MB
    files: 1, // Only one image per request
  },
});

// Error handler middleware for upload failures
const handleUploadErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer built-in errors (e.g., file too large)
    return res.status(400).json({
      success: false,
      error: err.code === 'LIMIT_FILE_SIZE' ? 'File too large (max 5MB)' : 'Upload failed',
    });
  } else if (err) {
    // Custom errors from fileFilter
    return res.status(400).json({ success: false, error: err.message });
  }
  next();
};

module.exports = {
  upload: multerInstance,
  handleUploadErrors,
};
