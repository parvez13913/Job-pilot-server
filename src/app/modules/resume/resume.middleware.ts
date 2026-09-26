import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

const uploadDirectory = path.join(
  process.cwd(),
  "uploads",
  "resumes"
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDirectory);
  },

  filename: (_req, file, cb) => {
    const uniqueName =
      `${crypto.randomUUID()}${path.extname(file.originalname)}`;

    cb(null, uniqueName);
  },
});

export const uploadResume = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(
        new Error("Only PDF files are allowed")
      );
    }

    cb(null, true);
  },
});