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

    const { id: userId, role } = req.user;

    // Jika user adalah user biasa, pastikan hanya bisa akses miliknya
    if (role === 'user' && consultation.user_id !== userId) {
      return res.status(403).json({ message: 'Akses ditolak. Bukan pemilik konsultasi.' });
    }

    // Jika role adalah expert, izinkan akses tanpa cek user_id
    // (atau tambahkan logika cek spesifik jika hanya boleh lihat konsultasi yang diarahkan padanya)

    req.consultation = consultation;
    next();
  } catch (error) {
    console.error('Error pengecekan kepemilikan konsultasi:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
  }
};
