import Consultation from '../models/ConsultationModel.js';
import User from '../models/UserModel.js';
import UserConsultation from '../models/UserConsultationModel.js';
import FishExpert from '../models/FishExpertsModel.js';
import FishExpertAnswer from '../models/FishExpertAnswerModel.js';
import jwt from "jsonwebtoken";
import FishTypes from '../models/FishTypeModel.js';
import "regenerator-runtime/runtime.js";

// Fungsi untuk mendapatkan semua konsultasi
export const getAllConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.findAll({
      include: [
        { model: User },
        { model: UserConsultation },
        { model: FishExpert },
        { model: FishExpertAnswer }
      ]
    });
    return res.success('Data konsultasi berhasil diambil', consultations);
  } catch (error) {
    return res.fail('Gagal mengambil data konsultasi', error.message, 500);
  }
};

// Fungsi untuk mendapatkan konsultasi berdasarkan ID
export const getConsultationById = async (req, res) => {
  try {
    // Ambil konsultasi berdasarkan ID dari parameter
    const consultation = await Consultation.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['id', 'name', 'email'] }, // Pilih atribut spesifik untuk efisiensi
        { model: UserConsultation, attributes: ['id', 'consultation_topic', 'complaint'] },
        { model: FishExpert, attributes: ['id', 'name', 'specialization'] },
        { model: FishExpertAnswer, attributes: ['id', 'answer', 'createdAt'] }
      ]
    });

    // Jika data tidak ditemukan
    if (!consultation) {
      return res.fail('Konsultasi tidak ditemukan', null, 404);
    }

    // Berhasil mengambil data
    return res.success('Data konsultasi berhasil diambil', consultation);
  } catch (error) {
    // Tangani error
    console.error('Error fetching consultation data:', error);
    return res.fail('Gagal mengambil data konsultasi', error.message, 500);
  }
};

// Fungsi untuk membuat konsultasi baru
export const createConsultation = async (req, res) => {
  try {
    const { 
      user_id, 
      user_consultation_id, 
      fishExpert_id = null, 
      fish_expert_answer_id = null, 
      consultation_status = "Waiting" 
    } = req.body;

    console.log("Received Data in createConsultation:", req.body);

    if (!user_id || !user_consultation_id) {
      return res.fail("user_id dan user_consultation_id wajib diisi");
    }

    const newConsultation = await Consultation.create({
      user_id,
      user_consultation_id,
      fishExpert_id,
      fish_expert_answer_id,
      consultation_status,
    });

    console.log("Data Disimpan ke Tabel Consultations:", newConsultation);

    return res.success('Konsultasi berhasil ditambahkan', newConsultation);
  } catch (error) {
    console.error('Error creating consultation:', error);
    return res.fail('Gagal menambahkan konsultasi', error.message, 500);
  }
};

// Fungsi untuk memperbarui konsultasi berdasarkan ID
export const updateConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);
    if (!consultation) {
      return res.fail('Konsultasi tidak ditemukan', null, 404);
    }

    const { fish_expert_answer_id, consultation_status } = req.body;

    // Log data yang diterima
    console.log('Received fish_expert_answer_id:', fish_expert_answer_id);
    console.log('Received consultation_status:', consultation_status);

    // Perbarui hanya kolom yang dibutuhkan
    await consultation.update({
      fish_expert_answer_id,
      consultation_status,
    });

    // Log data setelah diupdate
    console.log('Updated consultation:', consultation);

    return res.success('Konsultasi berhasil diperbarui', consultation);
  } catch (error) {
    console.error('Error updating consultation:', error);
    return res.fail('Gagal memperbarui konsultasi', error.message, 500);
  }
};

export const getConsultationHistory = async (req, res) => {
  const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;

  if (!token) {
    return res.fail("Token tidak ditemukan.", null, 401);
  }

  try {
    // Decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    if (!userId) {
      return res.fail("User ID tidak ditemukan dalam token.");
    }

    console.log("User ID:", userId); // Debug log

    // Query ke database untuk mendapatkan riwayat konsultasi
    const consultations = await Consultation.findAll({
      where: { user_id: userId }, // Filter berdasarkan user_id
      attributes: [
        "consultation_id",
        "user_consultation_id",
        "fishExpert_id",
        "fish_expert_answer_id",
        "consultation_status",
      ],
      include: [
        {
          model: UserConsultation,
          attributes: [
            "fish_type_id",
            "fish_age",
            "fish_length",
            "fish_weight",
            "consultation_topic",
            "fish_image",
            "complaint",
            "created_at",
          ],
        },
        {
          model: FishExpert,
          attributes: ["name", "specialization"],
        },
        {
          model: FishExpertAnswer,
          attributes: ["answer", "created_at"],
        },
      ],
      order: [["consultation_id", "DESC"]],
      raw: true,
    });

    if (consultations.length === 0) {
      return res.fail("Belum ada riwayat konsultasi.", null, 404);
    }
    
    console.log("Consultations Data:", consultations);
    return res.success("Berhasil mengambil riwayat konsultasi", consultations);
  } catch (error) {
    console.error("Error saat mengambil riwayat konsultasi:", error.message); // Debug log
    return res.fail("Gagal mengambil riwayat konsultasi.", error.message, 500);
  }
};

export const getConsultation = async (req, res) => {
  const { id } = req.params;
  console.log('ID konsultasi:', id);

  try {
    const consultation = await Consultation.findOne({
      where: { consultation_id: id },
      attributes: ['created_at', 'chat_enabled', 'consultation_status'], // Ambil created_at langsung
      include: [
        {
          model: User,
          attributes: ['user_id', 'name', 'email'],
        },
        {
          model: UserConsultation,
          attributes: [
            'user_consultation_id',
            'complaint',
            'consultation_topic',
            'fish_type_id',
            'fish_length',
            'fish_weight',
            'fish_age',
            'fish_image',
          ],
          include: [
            {
              model: FishTypes,
              attributes: ['name'],
            },
          ],
        },
        {
          model: FishExpert,
          attributes: ['fishExperts_id', 'name', 'specialization'],
        },
        {
          model: FishExpertAnswer,
          attributes: ['fish_expert_answer_id', 'answer', 'image'],
        },
      ],
    });

    console.log('Consultation data:', JSON.stringify(consultation, null, 2));

    if (!consultation) {
      return res.fail('Konsultasi tidak ditemukan', null, 404);
    }

    const userName = consultation.User ? consultation.User.name : 'Tidak ada nama pengguna';
    const complaint = consultation.UserConsultation ? consultation.UserConsultation.complaint : 'Tidak ada keluhan';
    const answer = consultation.FishExpertAnswer ? consultation.FishExpertAnswer.answer : 'Belum ada jawaban dari ahli ikan';
    const answerImage = consultation.FishExpertAnswer ? consultation.FishExpertAnswer.image : 'Tidak ada gambar jawaban';
    const consultationTopic = consultation.UserConsultation ? consultation.UserConsultation.consultation_topic : 'Tidak ada topik konsultasi';

    const fishExpert = consultation.FishExpert || {};
    const fishExpertName = fishExpert.name || 'Tidak ada nama ahli ikan';
    const fishExpertSpecialization = fishExpert.specialization || 'Tidak ada spesialisasi';

    const fishTypeName = consultation.UserConsultation && consultation.UserConsultation.FishType ? consultation.UserConsultation.FishType.name : 'Tidak ada jenis ikan';
    const fishLength = consultation.UserConsultation ? consultation.UserConsultation.fish_length : 'Tidak ada panjang ikan';
    const fishAge = consultation.UserConsultation ? consultation.UserConsultation.fish_age : 'Tidak ada umur ikan';
    const fishImage = consultation.UserConsultation ? consultation.UserConsultation.fish_image : '[]';
    const fishWeight = consultation.UserConsultation ? consultation.UserConsultation.fish_weight : 'Tidak ada berat ikan';
    // Tambahkan chat_enabled, consultation_status, dan created_at
    const chatEnabled = consultation.chat_enabled;
    const consultationStatus = consultation.consultation_status;
    const createdAt = consultation.created_at; // Ambil tanggal konsultasi dibuat

    const consultationData = {
      title: consultationTopic,
      description: complaint,
      answer: answer,
      name: userName,
      fish_expert_name: fishExpertName,
      fish_expert_specialization: fishExpertSpecialization,
      fish_type: fishTypeName,
      fish_length: fishLength,
      fish_weight: fishWeight,
      fish_age: fishAge,
      fish_image: fishImage,
      answer_image: answerImage,
      chat_enabled: chatEnabled, 
      consultation_status: consultationStatus,
      created_at: createdAt,
    };

    return res.success('Data konsultasi berhasil diambil', consultationData);
  } catch (error) {
    console.error('Error:', error.message, error.stack);
    return res.fail('Terjadi kesalahan pada server', error.message, 500);
  }
};

export const enableChat = async (req, res) => {
  const { id } = req.params;

  try {
    const consultation = await Consultation.findByPk(id);
    if (!consultation) {
      return res.fail("Konsultasi tidak ditemukan", null, 404);
    }

    // Update chat_enabled menjadi true
    consultation.chat_enabled = true;
    await consultation.save();

    return res.success("Fitur chat telah diaktifkan");
  } catch (error) {
    console.error("Error:", error.message);
    return res.fail("Terjadi kesalahan pada server", error.message, 500);
  }
};

export const endConsultation = async (req, res) => {
  const { id } = req.params;

  try {
    // Cek apakah konsultasi ada
    const consultation = await Consultation.findByPk(id);
    if (!consultation) {
      return res.fail("Konsultasi tidak ditemukan", null, 404);
    }

    // Update status konsultasi menjadi "Closed"
    consultation.consultation_status = "Closed";
    await consultation.save();

    return res.success("Konsultasi berhasil diakhiri");
  } catch (error) {
    console.error("Error saat mengupdate status konsultasi:", error.message);
    return res.fail("Terjadi kesalahan saat mengakhiri konsultasi", error.message, 500);
  }
};