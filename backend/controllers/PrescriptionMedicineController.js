import PrescriptionMedicine from '../models/PrescriptionMedicineModel.js';

export const getAllPrescriptionMedicines = async (req, res) => {
  try {
    const prescriptionMedicines = await PrescriptionMedicine.findAll();
    res.status(200).json(prescriptionMedicines);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data prescriptions_medicine', error: error.message });
  }
};

export const createPrescriptionMedicine = async (req, res) => {
    try {
      const { prescription_id, medicine_id } = req.body;
      
      if (!prescription_id || !medicine_id) {
        return res.status(400).json({ message: 'prescription_id dan medicine_id harus diisi' });
      }
  
      const newPrescriptionMedicine = await PrescriptionMedicine.create({
        prescription_id,
        medicine_id
      });
  
      res.status(201).json(newPrescriptionMedicine);
    } catch (error) {
      res.status(500).json({ message: 'Gagal menambahkan data resep obat', error: error.message });
    }
  };
  
  