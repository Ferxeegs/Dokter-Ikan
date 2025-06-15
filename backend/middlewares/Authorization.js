import Consultation from '../models/ConsultationModel.js'; // sesuaikan path dan model kamu

export const checkConsultationOwnership = async (req, res, next) => {
  const consultationId = req.params.id || req.query.consultation_id;

  if (!consultationId) {
    return res.status(400).json({ message: 'ID konsultasi tidak ditemukan' });
  }

  try {
    const consultation = await Consultation.findByPk(consultationId);

    if (!consultation) {
      return res.status(404).json({ message: 'Data konsultasi tidak ditemukan' });
    }

    // Pastikan user yang login adalah pemilik konsultasi
    if (consultation.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Akses ditolak. Bukan pemilik konsultasi.' });
    }

    // Jika semua valid, simpan konsultasi ke request dan lanjut
    req.consultation = consultation;
    next();
  } catch (error) {
    console.error('Error pengecekan kepemilikan konsultasi:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
