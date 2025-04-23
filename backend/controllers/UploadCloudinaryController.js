import cloudinary from "../config/CloudinaryConfig.js";
import multer from "multer";

// Setup multer untuk menyimpan file di buffer memory
const uploadcloud = multer({ storage: multer.memoryStorage() }).array("files", 10); // Bisa upload hingga 10 file

const uploadImagesUser = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Upload semua file ke Cloudinary
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "userpost" },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              public_id: result.public_id,
            });
          }
        ).end(file.buffer);
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Log data yang dikirimkan ke frontend
    console.log("Uploaded images:", uploadedImages);

    res.json({ images: uploadedImages });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: error.message });
  }
};

const uploadImagesExpert = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Upload semua file ke Cloudinary
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "expertpost" },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              public_id: result.public_id,
            });
          }
        ).end(file.buffer);
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Log data yang dikirimkan ke frontend
    console.log("Uploaded images:", uploadedImages);

    res.json({ images: uploadedImages });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: error.message });
  }
};
const uploadPaymentProof = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Upload semua file ke Cloudinary
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "payment" },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              url: result.secure_url,
              public_id: result.public_id,
            });
          }
        ).end(file.buffer);
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Log data yang dikirimkan ke frontend
    console.log("Uploaded images:", uploadedImages);

    res.json({ images: uploadedImages });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: error.message });
  }
};

// Fungsi menghapus gambar berdasarkan public_id
const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.status(400).json({ message: "No public_id provided" });
    }

    // Hapus gambar dari Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== "ok") {
      return res.status(500).json({ message: "Failed to delete image from Cloudinary" });
    }

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ error: error.message });
  }
};

export { uploadcloud, uploadImagesUser, uploadImagesExpert, uploadPaymentProof, deleteImage };