import Symptom from "../models/SymptomModel.js";
import "regenerator-runtime/runtime.js";

// Get all symptoms
export const getSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptom.findAll();
    return res.success('Berhasil mengambil data gejala', symptoms);
  } catch (error) {
    return res.fail('Gagal mengambil data gejala', error.message, 500);
  }
};

// Get symptom by ID
export const getSymptomById = async (req, res) => {
  try {
    const symptom = await Symptom.findByPk(req.params.id);
    if (!symptom) {
      return res.fail('Gejala tidak ditemukan', 'Gejala dengan id tersebut tidak ditemukan', 404);
    }
    return res.success('Berhasil mengambil data gejala', symptom);
  } catch (error) {
    return res.fail('Gagal mengambil data gejala', error.message, 500);
  }
};