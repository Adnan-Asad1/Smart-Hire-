import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Upload folder ka absolute path
const uploadPath = path.join(process.cwd(), "uploads", "documents");

// ✅ Agar folder nahi bana to create kar do
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath); // hamesha correct absolute path milega
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// ✅ File filter (allowed types only)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpg|jpeg|png|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (extname) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, PNG, DOCX files are allowed!"));
  }
};

export const upload = multer({ storage, fileFilter });
