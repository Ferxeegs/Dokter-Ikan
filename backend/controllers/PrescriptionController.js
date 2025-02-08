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
    const { consultation_id, fishExperts_id, instruction } = req.body; // Tambahkan instruction
    
    if (!consultation_id || !fishExperts_id) {
      return res.status(400).json({ message: 'consultation_id dan fishExperts_id harus diisi' });
    }

    const newPrescription = await Prescription.create({
      consultation_id,
      fishExperts_id,
      instruction, // Simpan instruction di database
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
    const prescription = await Prescription.findOne({
      where: { consultation_id },
      attributes: ['prescription_id', 'instruction'], // Ambil prescription_id dan instruction
    });

    console.log('Prescription found:', prescription); // Log prescription yang ditemukan

    if (!prescription) {
      return res.status(404).json({ message: 'Resep tidak ditemukan untuk konsultasi ini.' });
    }

    // Mencari semua medicine_id yang terkait dengan prescription_id
    const prescriptionMedicines = await PrescriptionMedicine.findAll({
      where: { prescription_id: prescription.prescription_id },
    });

    console.log('Prescription Medicines found:', prescriptionMedicines); // Log prescriptionMedicines yang ditemukan

    // Menyiapkan data obat
    const medicines = await Promise.all(
      prescriptionMedicines.map(async (prescriptionMedicine) => {
        const medicine = await Medicine.findOne({
          where: { medicine_id: prescriptionMedicine.medicine_id },
        });

        console.log(`Medicine found: ${medicine ? medicine.medicine_name : 'Tidak ditemukan'}`); // Log nama obat

        return {
          title: medicine?.medicine_name || 'Tidak ditemukan',
          content: medicine?.contain || '',
          dose: medicine?.dosage || '',
          image: medicine?.medicine_image || '',
        };
      })
    );

    console.log('Medicines prepared:', medicines); // Log obat yang telah dipersiapkan

    // Mengirimkan data resep dan obat yang terkait
    res.status(200).json({
      prescription_id: prescription.prescription_id,
      instruction: prescription.instruction, // Tambahkan instruction ke dalam respons
      medicines: medicines,
    });
  } catch (error) {
    console.error('Error occurred:', error); // Log error yang terjadi
    res.status(500).json({ error: 'Gagal mengambil data resep dan obat', details: error.message });
  }
};

