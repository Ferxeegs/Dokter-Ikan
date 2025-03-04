import Symptom from "../models/SymptomModel.js";
import "regenerator-runtime/runtime";


// Get all symptoms
export const getSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptom.findAll();
    res.status(200).json({ success: true, data: symptoms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get symptom by ID
export const getSymptomById = async (req, res) => {
  try {
    const symptom = await Symptom.findByPk(req.params.id);
    if (!symptom) {
      return res.status(404).json({ success: false, message: "Symptom not found" });
    }
    res.status(200).json({ success: true, data: symptom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
