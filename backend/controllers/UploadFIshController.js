import fs from "fs";
import axios from "axios";
import multer from "multer";
import FormData from "form-data";  // Import form-data
import "regenerator-runtime/runtime";


// Konfigurasi Multer untuk menyimpan file di folder 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');  // Tentukan folder upload
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // Menyimpan file dengan timestamp
  }
});

const upload = multer({ storage }).single('file');  // 'file' adalah nama field di form data
const MODEL_API_URL = process.env.MODEL_API_URL;  // URL model AI

// Fungsi upload
export const uploadFishImage = async (req, res) => {
  console.log("Start uploadFishImage function");  // Log untuk debugging

  // Pastikan file diterima di request body
  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err.message);  // Log error upload
      return res.status(400).json({ success: false, message: "Error uploading file" });
    }

    if (!req.file) {
      console.error("No file uploaded");  // Log jika file tidak ditemukan
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    console.log("File uploaded successfully:", req.file.path);  // Log jika file berhasil diupload

    try {
      // Baca file gambar yang diupload
      const imagePath = req.file.path;

      // Kirim gambar ke backend model AI dalam form-data
      const formData = new FormData();
      formData.append('image', fs.createReadStream(imagePath));  // Menambahkan file gambar ke form-data

      console.log("Sending image to AI model");  // Log untuk proses pengiriman gambar ke AI

      // Menggunakan axios untuk mengirim form-data ke backend model
      const response = await axios.post(MODEL_API_URL, formData, {
        headers: {
          ...formData.getHeaders(),  // Menambahkan header dari form-data secara otomatis
        },
      });

      console.log("Received response from AI model:", response.data);  // Log hasil dari AI model

      // Hapus file setelah dikirim ke AI
      fs.unlinkSync(imagePath);

      // Pastikan response dari AI memiliki struktur yang jelas
      // Response yang diterima sudah berupa array, bukan objek dengan 'predictions'
      if (!response.data || response.data.length === 0) {
        console.error("AI model did not return valid predictions");  // Log jika tidak ada prediksi
        return res.status(500).json({ success: false, message: "AI model did not return predictions" });
      }

      return res.json({
        success: true,
        message: "Image processed successfully",
        predictions: response.data,  // Menyertakan langsung array hasil prediksi
      });
    } catch (error) {
      console.error("Error:", error.message);  // Log error jika ada masalah saat pengiriman
      return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  });
};
