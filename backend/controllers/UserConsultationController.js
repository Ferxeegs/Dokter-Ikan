import UserConsultation from "../models/UserConsultationModel.js";
import { validationResult } from "express-validator"; // Untuk validasi input
import db from "../config/Database.js";
import jwt from "jsonwebtoken"; 

// Fungsi untuk mendapatkan semua data konsultasi
export const getAllUserConsultations = async (req, res) => {
  try {
    const consultations = await UserConsultation.findAll({
      attributes: [
        "user_consultation_id",
        "user_id",
        "fish_type_id",
        "fish_age",
        "fish_length",
        "consultation_topic",
        "fish_image",
        "complaint",
        "consultation_status",
      ],
    });

    if (consultations.length === 0) {
      return res.status(404).json({ message: "Belum ada data konsultasi." });
    }

    res.status(200).json({ data: consultations });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil data konsultasi.", error: error.message });
  }
};


// Fungsi untuk mendapatkan data konsultasi berdasarkan ID
export const getUserConsultationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validasi apakah ID diberikan
    if (!id) {
      return res.status(400).json({ message: "ID konsultasi diperlukan." });
    }

    // Mencari data konsultasi berdasarkan ID
    const consultation = await UserConsultation.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    // Jika data tidak ditemukan
    if (!consultation) {
      return res.status(404).json({ message: "Konsultasi tidak ditemukan." });
    }

    // Jika berhasil ditemukan
    return res.status(200).json({
      success: true,
      message: "Data konsultasi berhasil diambil.",
      data: consultation,
    });
  } catch (error) {
    // Menangani error internal server
    console.error("Error fetching consultation:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat mengambil data konsultasi.",
      error: error.message,
    });
  }
};


export const getUserConsultationHistory = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan." });
  }

  try {
    // Decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decodedToken); // Debugging log
    const userId = decodedToken.id; // Ambil `id` dari token

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID tidak ditemukan dalam token." 
      });
    }

    console.log("User ID:", userId); // Debug log

    // Query ke database
    const consultations = await UserConsultation.findAll({
      where: { user_id: userId }, // Filter berdasarkan user_id
      attributes: [
        "user_consultation_id",
        "fish_type_id",
        "fish_age",
        "fish_length",
        "consultation_topic",
        "fish_image",
        "complaint",
        "consultation_status",
        "created_at",
      ],
      order: [["created_at", "DESC"]],
    });

    if (consultations.length === 0) {
      return res.status(404).json({ message: "Belum ada riwayat konsultasi." });
    }

    res.status(200).json({
      success: true,
      data: consultations,
    });
  } catch (error) {
    console.error("Error saat mengambil riwayat konsultasi:", error.message); // Debug log
    res.status(500).json({
      success: false,
      message: "Gagal mengambil riwayat konsultasi.",
      error: error.message,
    });
  }
};


// Fungsi untuk menambahkan konsultasi baru
export const createUserConsultation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: "Harap mengisi semua kolom yang tersedia!",
      errors: errors.array() 
    });
  }

  const {
    user_id,
    fish_type_id,
    fish_age,
    fish_length,
    consultation_topic,
    fish_image,
    complaint,
    consultation_status,
  } = req.body;

  console.log("Received Data from Client:", req.body);

  const transaction = await db.transaction();

  try {
    const newConsultation = await UserConsultation.create(
      {
        user_id,
        fish_type_id,
        fish_age,
        fish_length,
        consultation_topic,
        fish_image,
        complaint,
        consultation_status,
      },
      { transaction }
    );

    console.log("newConsultation Data Values:", newConsultation.dataValues);

    await transaction.commit();

    const responseData = {
      id: newConsultation.dataValues.user_consultation_id,
      user_consultation_id: newConsultation.dataValues.user_consultation_id,
    };

    console.log("Respons yang Dikembalikan ke Frontend:", responseData);

    res.status(201).json({
      message: "Konsultasi berhasil ditambahkan!",
      data: responseData,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Error saat menyimpan konsultasi:", error);
    res.status(500).json({
      message: "Gagal menambahkan konsultasi",
      error: error.message,
    });
  }
};



// Fungsi untuk memperbarui data konsultasi berdasarkan ID
export const updateUserConsultation = async (req, res) => {
  const { id } = req.params;

  try {
    const consultation = await UserConsultation.findByPk(id);

    if (!consultation) {
      return res.status(404).json({ message: "Konsultasi tidak ditemukan." });
    }

    const updatedConsultation = await consultation.update(req.body);
    res.status(200).json({
      message: "Konsultasi berhasil diperbarui.",
      data: updatedConsultation,
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui konsultasi.", error: error.message });
  }
};


