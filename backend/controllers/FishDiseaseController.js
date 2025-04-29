import FishDisease from "../models/FishDiseaseModel.js";
import axios from "axios";
import "regenerator-runtime/runtime.js";

const DIAGNOSE_API_URL = process.env.DIAGNOSE_API_URL; // URL untuk sistem pakar

// Get all fish diseases
export const getFishDiseases = async (req, res) => {
  try {
    const diseases = await FishDisease.findAll();
    return res.success("Berhasil mengambil data penyakit ikan", diseases);
  } catch (error) {
    console.error("Error getting fish diseases:", error);
    return res.fail("Gagal mengambil data penyakit ikan", error.message, 500);
  }
};

// Diagnose fish disease by sending symptoms to Flask API
export const diagnoseFish = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.fail("Gejala tidak boleh kosong");
    }

    // Kirim data ke Flask API di port 5000
    const response = await axios.post(DIAGNOSE_API_URL, {
      symptoms, // Kirim daftar kode gejala
    });

    return res.success("Diagnosis berhasil dilakukan", response.data);
  } catch (error) {
    console.error("Error saat menghubungi expert system:", error.message);
    return res.fail("Gagal menghubungi sistem pakar", error.message, 500);
  }
};

export const getFishDiseasesByNames = async (req, res) => {
  try {
    const { diseases } = req.body;

    if (!diseases || !Array.isArray(diseases) || diseases.length === 0) {
      return res.fail("Daftar penyakit tidak boleh kosong");
    }

    const fishDiseases = await FishDisease.findAll({
      where: {
        name: diseases,
      },
    });

    if (fishDiseases.length === 0) {
      return res.success("Tidak ada penyakit yang ditemukan dengan nama yang diberikan", []);
    }

    return res.success("Berhasil mengambil data penyakit ikan", fishDiseases);
  } catch (error) {
    console.error("Error getting fish diseases by names:", error);
    return res.fail("Gagal mengambil data penyakit ikan", error.message, 500);
  }
};