import UserConsultation from "../models/UserConsultationModel.js";
// Fungsi untuk mendapatkan semua data konsultasi
export const getAllUserConsultations = async (req, res) => {
    try {
      const consultations = await UserConsultation.findAll();
      res.status(200).json(consultations);
    } catch (error) {
      res.status(500).json({ message: 'Gagal mengambil data konsultasi', error });
    }
  };

// Fungsi untuk mendapatkan data konsultasi berdasarkan ID
export const getUserConsultationById = async (req, res) => {
    try {
      const consultation = await UserConsultation.findByPk(req.params.id);
      if (!consultation) {
        return res.status(404).json({ message: 'Konsultasi tidak ditemukan' });
      }
      res.status(200).json(consultation);
    } catch (error) {
      res.status(500).json({ message: 'Gagal mengambil data konsultasi', error });
    }
  };

// Fungsi untuk menambahkan konsultasi baru
export const createUserConsultation = async (req, res) => {
    try {
      const {
        user_id,
        fish_type_id,
        fish_age,
        fish_length,
        consultation_topic,
        fish_image,
        complaint,
        consultation_status
      } = req.body;
  
      // Membuat data baru di tabel UserConsultation
      const newConsultation = await UserConsultation.create({
        user_id,
        fish_type_id,
        fish_age,
        fish_length,
        consultation_topic,
        fish_image,
        complaint,
        consultation_status
      });
  
      // Mengirim respons jika berhasil
      res.status(201).json({
        message: 'Konsultasi berhasil ditambahkan',
        data: newConsultation
      });
  
    } catch (error) {
      // Mengirim respons jika terjadi error
      res.status(500).json({
        message: 'Gagal menambahkan konsultasi',
        error: error.message
      });
    }
  };