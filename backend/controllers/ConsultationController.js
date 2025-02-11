import Consultation from '../models/ConsultationModel.js';
import User from '../models/UserModel.js';
import UserConsultation from '../models/UserConsultationModel.js';
import FishExpert from '../models/FishExpertsModel.js';
import FishExpertAnswer from '../models/FishExpertAnswerModel.js';
import jwt from "jsonwebtoken";
import FishTypes from '../models/FishTypeModel.js';


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
    res.status(200).json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data konsultasi', error });
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
      return res.status(404).json({ message: 'Konsultasi tidak ditemukan' });
    }

    // Berhasil mengambil data
    return res.status(200).json(consultation);
  } catch (error) {
    // Tangani error
    console.error('Error fetching consultation data:', error);
    return res.status(500).json({ message: 'Gagal mengambil data konsultasi', error: error.message });
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
      return res.status(400).json({
        message: "user_id dan user_consultation_id wajib diisi",
      });
    }

    const newConsultation = await Consultation.create({
      user_id,
      user_consultation_id,
      fishExpert_id,
      fish_expert_answer_id,
      consultation_status,
    });

    console.log("Data Disimpan ke Tabel Consultations:", newConsultation);

    res.status(201).json({
      message: 'Konsultasi berhasil ditambahkan',
      data: newConsultation,
    });
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({ 
      message: 'Gagal menambahkan konsultasi', 
      error: error.message 
    });
  }
};



// Fungsi untuk memperbarui konsultasi berdasarkan ID
export const updateConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: 'Konsultasi tidak ditemukan' });
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

    res.status(200).json({ message: 'Konsultasi berhasil diperbarui', consultation });
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({ message: 'Gagal memperbarui konsultasi', error });
  }
};

export const getConsultationHistory = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token tidak ditemukan." });
  }

  try {
    // Decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: "User ID tidak ditemukan dalam token." 
      });
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
      return res.status(404).json({ 
        success: false, 
        message: "Belum ada riwayat konsultasi." 
      });
    }
    console.log("Consultations Data:", consultations);
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

export const getConsultation = async (req, res) => {
  const { id } = req.params;
  console.log('ID konsultasi:', id);

  try {
    const consultation = await Consultation.findOne({
      where: { consultation_id: id },
      include: [
        {
          model: User,
          attributes: ['user_id', 'name', 'email'],
        },
        {
          model: UserConsultation,
          attributes: ['user_consultation_id', 'complaint', 'consultation_topic', 'fish_type_id', 'fish_length', 'fish_age', 'fish_image'],
          include: [
            {
              model: FishTypes, // Pastikan ada relasi di model Sequelize
              attributes: ['name'], // Ambil nama ikan
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
      return res.status(404).json({ error: 'Konsultasi tidak ditemukan' });
    }

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

    // Tambahkan chat_enabled
    const chatEnabled = consultation.chat_enabled;
    const consultationStatus = consultation.consultation_status;

    res.json({
      title: consultationTopic,
      description: complaint,
      answer: answer,
      fish_expert_name: fishExpertName,
      fish_expert_specialization: fishExpertSpecialization,
      fish_type: fishTypeName,
      fish_length: fishLength,
      fish_age: fishAge,
      fish_image: fishImage,
      answer_image: answerImage,
      chat_enabled: chatEnabled, 
      consultation_status: consultationStatus,
    });
  } catch (error) {
    console.error('Error:', error.message, error.stack);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

export const enableChat = async (req, res) => {
  const { id } = req.params;

  try {
    const consultation = await Consultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({ error: "Konsultasi tidak ditemukan" });
    }

    // Update chat_enabled menjadi true
    consultation.chat_enabled = true;
    await consultation.save();

    res.json({ message: "Fitur chat telah diaktifkan." });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server." });
  }
};

export const endConsultation = async (req, res) => {
  const { id } = req.params;

  try {
    // Cek apakah konsultasi ada
    const consultation = await Consultation.findByPk(id);
    if (!consultation) {
      return res.status(404).json({ error: "Konsultasi tidak ditemukan" });
    }

    // Update status konsultasi menjadi "Closed"
    consultation.consultation_status = "Closed";
    await consultation.save();

    res.json({ message: "Konsultasi berhasil diakhiri" });
  } catch (error) {
    console.error("Error saat mengupdate status konsultasi:", error.message);
    res.status(500).json({ error: "Terjadi kesalahan saat mengakhiri konsultasi" });
  }
};




