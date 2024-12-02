import MedicalPrescription from '../models/MedicalPrescriptionModel.js';
import Consultation from '../models/ConsultationModel.js';
import Medicine from '../models/MedicineModel.js';

// Fungsi untuk mendapatkan semua resep medis
export const getAllMedicalPrescriptions = async (req, res) => {
  try {
    const prescriptions = await MedicalPrescription.findAll({
      include: [
        { model: Consultation },
        { model: Medicine }
      ]
    });
    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data resep medis', error });
  }
};

// Fungsi untuk mendapatkan resep medis berdasarkan ID
export const getMedicalPrescriptionById = async (req, res) => {
  try {
    const prescription = await MedicalPrescription.findByPk(req.params.id, {
      include: [
        { model: Consultation },
        { model: Medicine }
      ]
    });
    if (!prescription) {
      return res.status(404).json({ message: 'Resep medis tidak ditemukan' });
    }
    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data resep medis', error });
  }
};

// Fungsi untuk menambahkan resep medis baru
export const createMedicalPrescription = async (req, res) => {
  try {
    const { consultation_id, medicine_id, prescription_date, dose, instruction } = req.body;
    
    const newPrescription = await MedicalPrescription.create({
      consultation_id,
      medicine_id,
      prescription_date,
      dose,
      instruction
    });
    res.status(201).json({ message: 'Resep medis berhasil ditambahkan', data: newPrescription });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan resep medis', error });
  }
};

// Fungsi untuk memperbarui data resep medis
export const updateMedicalPrescription = async (req, res) => {
  try {
    const prescription = await MedicalPrescription.findByPk(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Resep medis tidak ditemukan' });
    }

    const { consultation_id, medicine_id, prescription_date, dose, instruction } = req.body;
    await prescription.update({
      consultation_id,
      medicine_id,
      prescription_date,
      dose,
      instruction
    });

    res.status(200).json({ message: 'Resep medis berhasil diperbarui', data: prescription });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui resep medis', error });
  }
};

// Fungsi untuk menghapus resep medis
export const deleteMedicalPrescription = async (req, res) => {
  try {
    const prescription = await MedicalPrescription.findByPk(req.params.id);
    if (!prescription) {
      return res.status(404).json({ message: 'Resep medis tidak ditemukan' });
    }

    await prescription.destroy();
    res.status(200).json({ message: 'Resep medis berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus resep medis', error });
  }
};
