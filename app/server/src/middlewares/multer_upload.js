import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Get __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure Uploads/ directory exists at the project root
const uploadDir = path.resolve(__dirname, "../../Uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Use disk storage to save in /Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `complaint-${timestamp}${ext}`);
  },
});

// Accept all image types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;

// import multer from "multer";
// import path from "path";
// import fs from "fs";
// import { fileURLToPath } from "url";

// // Get __dirname in ES module context
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Ensure Uploads/ directory exists at the project root
// // NOTE: Based on your error log, ensure this directory is exactly 'Uploads' 
// // and not 'Uploadss' in your file system.
// const uploadDir = path.resolve(__dirname, "../../Uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
//   console.log(`📂 Created upload directory at: ${uploadDir}`);
// } else {
//   // Log the active directory path for verification
//   console.log(`📂 Using upload directory at: ${uploadDir}`);
// }

// // Use disk storage to save in /Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const timestamp = Date.now();
//     // Use the original extension, but default to .jpg if missing
//     const ext = path.extname(file.originalname) || ".jpg"; 
//     // Ensure the filename is unique
//     cb(null, `complaint-${timestamp}${ext}`);
//   },
// });

// // Accept all image types
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     // Return a specific Multer error for better client handling (if needed)
//     cb(new Error("Only image files are allowed"), false);
//   }
// };

// // Multer instance for file handling
// const upload = multer({ 
//     storage, 
//     fileFilter,
//     // Add a file size limit (e.g., 10MB) to prevent excessively large uploads early
//     limits: { fileSize: 10 * 1024 * 1024 } 
// });

// export default upload;
