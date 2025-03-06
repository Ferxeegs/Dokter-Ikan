import FishDisease from "../models/FishDiseaseModel.js";
import axios from "axios";
import "regenerator-runtime/runtime.js";

// Get all fish diseases
export const getFishDiseases = async (req, res) => {
  try {
    const diseases = await FishDisease.findAll();
    res.status(200).json({ success: true, data: diseases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Diagnose fish disease by sending symptoms to Flask API
export const diagnoseFish = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ success: false, message: "Gejala tidak boleh kosong" });
    }

    // Kirim data ke Flask API di port 5000
    const response = await axios.post("http://localhost:5000/diagnose", {
      symptoms, // Kirim daftar kode gejala
    });

    return res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error saat menghubungi expert system:", error.message);
    return res.status(500).json({
      success: false,
      message: "Gagal menghubungi sistem pakar",
    });
  }
};

export const getFishDiseasesByNames = async (req, res) => {
  try {
    const { diseases } = req.body;

    if (!diseases || !Array.isArray(diseases) || diseases.length === 0) {
      return res.status(400).json({ success: false, message: "Daftar penyakit tidak boleh kosong" });
    }

    const fishDiseases = await FishDisease.findAll({
      where: {
        name: diseases,
      },
    });

    res.status(200).json({ success: true, data: fishDiseases });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};