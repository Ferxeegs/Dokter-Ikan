import cloudinary from "../config/CloudinaryConfig.js";
import multer from "multer";

// Setup multer untuk menyimpan file di buffer memory
const uploadcloud = multer({ storage: multer.memoryStorage() }).array("files", 10); // Bisa upload hingga 10 file

const uploadImagesUser = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.fail('Tidak ada file', 'No files uploaded');
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

    return res.success('Berhasil mengunggah gambar', { images: uploadedImages });
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.fail('Gagal mengunggah gambar', error.message, 500);
  }
};

const uploadProfileUser = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.fail('Tidak ada file', 'No files uploaded');
    }

    // Upload semua file ke Cloudinary
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "user" },
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

    return res.success('Berhasil mengunggah foto profil', { images: uploadedImages });
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.fail('Gagal mengunggah foto profil', error.message, 500);
  }
};

const uploadImagesExpert = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.fail('Tidak ada file', 'No files uploaded');
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

    return res.success('Berhasil mengunggah gambar', { images: uploadedImages });
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.fail('Gagal mengunggah gambar', error.message, 500);
  }
};

const uploadProfileExpert = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.fail('Tidak ada file', 'No files uploaded');
    }

    // Upload semua file ke Cloudinary
    const uploadPromises = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "expert" },
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

    return res.success('Berhasil mengunggah foto profil pakar', { images: uploadedImages });
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.fail('Gagal mengunggah foto profil pakar', error.message, 500);
  }
};

const uploadPaymentProof = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.fail('Tidak ada file', 'No files uploaded');
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

    return res.success('Berhasil mengunggah bukti pembayaran', { images: uploadedImages });
  } catch (error) {
    console.error("Error uploading images:", error);
    return res.fail('Gagal mengunggah bukti pembayaran', error.message, 500);
  }
};

// Fungsi menghapus gambar berdasarkan public_id
const deleteImage = async (req, res) => {
  try {
    const { public_id } = req.body;

    if (!public_id) {
      return res.fail('Data tidak lengkap', 'No public_id provided');
    }

    // Hapus gambar dari Cloudinary
    const result = await cloudinary.uploader.destroy(public_id);

    if (result.result !== "ok") {
      return res.fail('Gagal menghapus gambar', 'Failed to delete image from Cloudinary', 500);
    }

    return res.success('Berhasil menghapus gambar');
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.fail('Gagal menghapus gambar', error.message, 500);
  }
};

export { uploadcloud, uploadImagesUser, uploadImagesExpert, uploadPaymentProof, uploadProfileUser, uploadProfileExpert, deleteImage };