import PrescriptionMedicine from '../models/PrescriptionMedicineModel.js';
import "regenerator-runtime/runtime.js";

export const getAllPrescriptionMedicines = async (req, res) => {
  try {
    const prescriptionMedicines = await PrescriptionMedicine.findAll();
    return res.success('Berhasil mengambil data prescriptions_medicine', prescriptionMedicines);
  } catch (error) {
    return res.fail('Gagal mengambil data prescriptions_medicine', error.message, 500);
  }
};

export const createPrescriptionMedicine = async (req, res) => {
  try {
    const { prescription_id, medicine_id } = req.body;
    
    if (!prescription_id || !medicine_id) {
      return res.fail('Data tidak lengkap', 'prescription_id dan medicine_id harus diisi');
    }

    const newPrescriptionMedicine = await PrescriptionMedicine.create({
      prescription_id,
      medicine_id
    });

    return res.success('Berhasil menambahkan data resep obat', newPrescriptionMedicine);
  } catch (error) {
    return res.fail('Gagal menambahkan data resep obat', error.message, 500);
  }
};