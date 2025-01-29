import Prescription from '../models/PrescriptionModel.js';
import Consultation from '../models/ConsultationModel.js';
import FishExperts from '../models/FishExpertsModel.js';
import PrescriptionMedicine from '../models/PrescriptionMedicineModel.js';
import Medicine from '../models/MedicineModel.js';

// Fungsi untuk mendapatkan semua resep medis
export const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.findAll({
      include: [
        {
          model: Consultation, // Include model Consultation
          attributes: ['consultation_id'] // Atribut yang ingin diambil
        },
        {
          model: FishExperts, // Include model FishExpert
          attributes: ['fishExperts_id', 'name'] // Atribut yang ingin diambil
        }
      ]
    });

    // Jika data berhasil diambil
    res.status(200).json(prescriptions);
  } catch (error) {
    // Jika terjadi error
    res.status(500).json({ message: 'Gagal mengambil data resep medis', error: error.message });
  }
};

export const createPrescription = async (req, res) => {
  try {
    const { consultation_id, fishExperts_id } = req.body;
    
    if (!consultation_id || !fishExperts_id) {
      return res.status(400).json({ message: 'consultation_id dan fishExperts_id harus diisi' });
    }

    const newPrescription = await Prescription.create({
      consultation_id,
      fishExperts_id
    });

    res.status(201).json(newPrescription);
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan data resep medis', error: error.message });
  }
};

export const getPrescriptionsByConsultationId = async (req, res) => {
  const { consultation_id } = req.query;

  try {
    if (!consultation_id) {
      return res.status(400).json({ error: 'Consultation ID wajib diberikan' });
    }

    console.log(`Mencari resep dengan consultation_id: ${consultation_id}`);

    // Mencari resep berdasarkan consultation_id
    const prescriptions = await Prescription.findAll({
      where: { consultation_id: consultation_id },
    });

    console.log('Prescriptions found:', prescriptions);  // Log prescriptions yang ditemukan

    if (prescriptions.length === 0) {
      return res.status(404).json({ message: 'Resep tidak ditemukan untuk konsultasi ini.' });
    }

    // Ambil prescription_id dari hasil pertama (diasumsikan hanya ada satu resep per konsultasi)
    const prescription_id = prescriptions[0].prescription_id;
    console.log(`Prescription ID yang ditemukan: ${prescription_id}`);

    // Mencari semua medicine_id yang terkait dengan prescription_id
    const prescriptionMedicines = await PrescriptionMedicine.findAll({
      where: { prescription_id: prescription_id },
    });

    console.log('Prescription Medicines found:', prescriptionMedicines);  // Log prescriptionMedicines yang ditemukan

    // Menyiapkan data obat
    const medicines = await Promise.all(
      prescriptionMedicines.map(async (prescriptionMedicine) => {
        const medicine = await Medicine.findOne({
          where: { medicine_id: prescriptionMedicine.medicine_id },
        });
        console.log(`Medicine found: ${medicine ? medicine.name : 'Tidak ditemukan'}`);  // Log nama obat
        return {
          title: medicine.medicine_name,  // Nama obat
          content: medicine.contain,  // Kandungan obat
          dose: medicine.dosage,  // Dosis dari prescription_medicines
        };
      })
    );

    console.log('Medicines prepared:', medicines);  // Log obat yang telah dipersiapkan

    // Mengirimkan data resep dan obat yang terkait
    res.status(200).json({
      prescription_id: prescription_id,
      medicines: medicines,
    });
  } catch (error) {
    console.error('Error occurred:', error);  // Log error yang terjadi
    res.status(500).json({ error: 'Gagal mengambil data resep dan obat', details: error.message });
  }
};
