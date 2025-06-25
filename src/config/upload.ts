import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import path, { basename } from "path";

// uploads files inside src
const uploadsDir = path.join(__dirname,"..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${basename(file.originalname)}`;
    cb(null, safeName);
  }
});

function fileFilter(
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) {
  const allowedExt = /\.(pdf|doc|docx)$/i;
  const allowedMime = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  if (allowedExt.test(ext) && allowedMime.includes(mime)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF or Word files are allowed"));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, //5MB
});
