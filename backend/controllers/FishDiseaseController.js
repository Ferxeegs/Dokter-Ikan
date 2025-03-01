import FishDisease from "../models/FishDiseaseModel.js";

// Get all fish diseases
export const getFishDiseases = async (req, res) => {
  try {
    const diseases = await FishDisease.findAll();
    res.status(200).json({ success: true, data: diseases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get fish disease by ID
export const getFishDiseaseById = async (req, res) => {
  try {
    const disease = await FishDisease.findByPk(req.params.id);
    if (!disease) {
      return res.status(404).json({ success: false, message: "Disease not found" });
    }
    res.status(200).json({ success: true, data: disease });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
