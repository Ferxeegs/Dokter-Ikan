import Consultation from '../models/ConsultationModel.js';
import User from '../models/UserModel.js';
import UserConsultation from '../models/UserConsultationModel.js';
import FishExpert from '../models/FishExpertsModel.js';
import FishExpertAnswer from '../models/FishExpertAnswerModel.js';

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
    const consultation = await Consultation.findByPk(req.params.id, {
      include: [
        { model: User },
        { model: UserConsultation },
        { model: FishExpert },
        { model: FishExpertAnswer }
      ]
    });
    if (!consultation) {
      return res.status(404).json({ message: 'Konsultasi tidak ditemukan' });
    }
    res.status(200).json(consultation);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data konsultasi', error });
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
      consultation_status = "Pending" 
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

    const { user_id, user_consultation_id, fishExpert_id, fish_expert_answer_id, consultation_status } = req.body;

    await consultation.update({
      user_id,
      user_consultation_id,
      fishExpert_id,
      fish_expert_answer_id,
      consultation_status
    });

    res.status(200).json({ message: 'Konsultasi berhasil diperbarui', consultation });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui konsultasi', error });
  }
};

// Fungsi untuk menghapus konsultasi berdasarkan ID
export const deleteConsultation = async (req, res) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);
    if (!consultation) {
      return res.status(404).json({ message: 'Konsultasi tidak ditemukan' });
    }

    await consultation.destroy();
    res.status(200).json({ message: 'Konsultasi berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus konsultasi', error });
  }
};
