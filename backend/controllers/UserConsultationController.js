import UserConsultation from "../models/UserConsultationModel.js";
import { validationResult } from "express-validator"; // Untuk validasi input
import db from "../config/Database.js";
import jwt from "jsonwebtoken"; 
import "regenerator-runtime/runtime.js";

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
        "fish_weight",
        "complaint",
        "consultation_status",
      ],
    });

    if (consultations.length === 0) {
      return res.fail('Data tidak ditemukan', 'Belum ada data konsultasi.', 404);
    }

    return res.success('Berhasil mengambil data konsultasi', consultations);
  } catch (error) {
    return res.fail('Gagal mengambil data konsultasi', error.message, 500);
  }
};

// Fungsi untuk mendapatkan data konsultasi berdasarkan ID
export const getUserConsultationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validasi apakah ID diberikan
    if (!id) {
      return res.fail('Data tidak lengkap', 'ID konsultasi diperlukan.');
    }

    // Mencari data konsultasi berdasarkan ID
    const consultation = await UserConsultation.findByPk(id, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    // Jika data tidak ditemukan
    if (!consultation) {
      return res.fail('Data tidak ditemukan', 'Konsultasi tidak ditemukan.', 404);
    }

    // Jika berhasil ditemukan
    return res.success('Data konsultasi berhasil diambil', consultation);
  } catch (error) {
    // Menangani error internal server
    console.error("Error fetching consultation:", error);
    return res.fail('Terjadi kesalahan saat mengambil data konsultasi', error.message, 500);
  }
};

export const getUserConsultationHistory = async (req, res) => {
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

  if (!token) {
    return res.fail('Akses ditolak', 'Token tidak ditemukan.', 401);
  }

  try {
    // Decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decodedToken); // Debugging log
    const userId = decodedToken.id; // Ambil `id` dari token

    if (!userId) {
      return res.fail('Data tidak valid', 'User ID tidak ditemukan dalam token.');
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
        "fish_weight",
        "consultation_topic",
        "fish_image",
        "complaint",
        "consultation_status",
        "created_at",
      ],
      order: [["created_at", "DESC"]],
    });

    if (consultations.length === 0) {
      return res.fail('Data tidak ditemukan', 'Belum ada riwayat konsultasi.', 404);
    }

    return res.success('Berhasil mengambil riwayat konsultasi', consultations);
  } catch (error) {
    console.error("Error saat mengambil riwayat konsultasi:", error.message); // Debug log
    return res.fail('Gagal mengambil riwayat konsultasi', error.message, 500);
  }
};

// Fungsi untuk menambahkan konsultasi baru
export const createUserConsultation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.fail(
      'Validasi gagal', 
      'Harap mengisi semua kolom yang tersedia!',
      400,
      errors.array()
    );
  }

  const {
    user_id,
    fish_type_id,
    fish_age,
    fish_length,
    fish_weight,
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
        fish_weight,
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

    return res.success('Konsultasi berhasil ditambahkan!', responseData);
  } catch (error) {
    await transaction.rollback();
    console.error("Error saat menyimpan konsultasi:", error);
    return res.fail('Gagal menambahkan konsultasi', error.message, 500);
  }
};