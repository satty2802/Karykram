import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

// compute absolute uploads dir (backend/uploads)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "..", "uploads");

// ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

// Validate file type
const fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = fileTypes.test(file.mimetype);
  const extName = fileTypes.test(ext);
  if (mimeType && extName) return cb(null, true);
  cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;
