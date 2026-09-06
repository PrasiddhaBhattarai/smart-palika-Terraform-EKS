import sharp from "sharp";
import fs from "fs";
import path from "path";

const MAX_ALLOWED_SIZE = 550 * 1024; // 550 KB

const compressImage = async (req, res, next) => {
  try {
    if (!req.file) return next();

    const inputPath = req.file.path;
    const outputPath = inputPath.replace(/(\.[\w\d_-]+)$/i, "_compressed.jpg");

    let quality = 80;
    let buffer;

    do {
      buffer = await sharp(inputPath)
        .resize({ width: 1024 }) // Resize to max width
        .jpeg({ quality }) // Convert to JPEG
        .toBuffer();

      quality -= 10;
      if (quality < 30) break; // Prevent excessive degradation
    } while (buffer.length > MAX_ALLOWED_SIZE);

    // Write compressed image
    fs.writeFileSync(outputPath, buffer);

    // Safely remove the original file (Windows friendly)
    setTimeout(() => {
      try {
        if (fs.existsSync(inputPath)) {
          fs.rmSync(inputPath, { force: true });
          console.log("🗑️ Original image removed:", path.basename(inputPath));
        }
      } catch (unlinkErr) {
        console.warn("⚠️ Could not remove original image:", unlinkErr.message);
      }
    }, 300); // small delay ensures file handle is released

    // Update file info for next middleware
    req.file.path = outputPath;
    req.file.filename = path.basename(outputPath);
    req.file.mimetype = "image/jpeg";

    next();
  } catch (err) {
    console.error("Image compression failed:", err);
    return res.status(500).json({
      success: false,
      message: "Image compression failed.",
    });
  }
};

export { compressImage };


// import sharp from "sharp";
// import fs from "fs/promises"; // Use fs.promises for async operations
// import path from "path";

// const MAX_ALLOWED_SIZE = 550 * 1024; // 550 KB

// /**
//  * Middleware to resize and compress uploaded images to a maximum size of 550 KB.
//  * It uses asynchronous file handling to improve reliability and reduce file locking issues.
//  */
// const compressImage = async (req, res, next) => {
//   if (!req.file) {
//     return next();
//   }

//   const inputPath = req.file.path;
//   // Ensure the output file name uses a compressed suffix and is a JPEG
//   const outputPath = inputPath.replace(/(\.[\w\d_-]+)?$/i, "_compressed.jpg");

//   try {
//     let quality = 80;
//     let buffer;

//     // Iteratively reduce JPEG quality until the buffer size is below the max allowed size
//     do {
//       buffer = await sharp(inputPath)
//         .resize({ width: 1024, withoutEnlargement: true }) // Resize to max 1024 width, only if image is larger
//         .jpeg({ quality, mozjpeg: true }) // Convert to JPEG with mozjpeg for better compression
//         .toBuffer();

//       quality -= 10;
//       if (quality < 30) break; // Prevent excessive degradation
//     } while (buffer.length > MAX_ALLOWED_SIZE);

//     // Write compressed image asynchronously
//     await fs.writeFile(outputPath, buffer);
//     console.log(`✅ Image compressed and saved to: ${path.basename(outputPath)}`);

//     // Safely remove the original file after a short delay (500ms), essential for Windows EPERM issues
//     // Using fs.unlink (promises version)
//     setTimeout(async () => {
//       try {
//         await fs.unlink(inputPath);
//         console.log("🗑️ Original image removed:", path.basename(inputPath));
//       } catch (unlinkErr) {
//         // Log the EPERM error specifically, but allow the main request to continue
//         console.error(`❌ Cleanup Warning (EPERM fix): Could not remove original file (${path.basename(inputPath)}).`, unlinkErr);
//       }
//     }, 500); // Increased delay to 500ms for better OS handle release reliability

//     // Update file info for next middleware (e.g., Cloudinary upload)
//     req.file.path = outputPath;
//     req.file.filename = path.basename(outputPath);
//     req.file.mimetype = "image/jpeg";
//     req.file.size = buffer.length;

//     next();
//   } catch (err) {
//     console.error("Image compression or file write failed:", err);
//     // Attempt to clean up the original file if compression fails
//     try {
//         await fs.unlink(inputPath);
//     } catch (cleanupErr) {
//         console.warn("Could not clean up original file after compression failure:", cleanupErr.message);
//     }
//     return res.status(500).json({
//       success: false,
//       message: "Image processing failed. Please try a different image.",
//     });
//   }
// };

// export { compressImage };

