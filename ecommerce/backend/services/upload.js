const fs = require('fs');
const multer = require('multer');
const path = require('path');

const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
});

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const fileFilter = (req, file, cb) => {
  if (allowed.has(file.mimetype)) return cb(null, true);
  const err = new Error('Only JPG, PNG, WebP or GIF images are allowed');
  err.statusCode = 400;
  return cb(err);
};

const maxMb = Number(process.env.MAX_FILE_SIZE_MB) || 5;
const upload = multer({ storage, fileFilter, limits: { fileSize: maxMb * 1024 * 1024 } });

module.exports = { upload };
