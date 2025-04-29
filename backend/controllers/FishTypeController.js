import FishType from "../models/FishTypeModel.js"; // Import model FishType
import "regenerator-runtime/runtime.js";

// Fungsi untuk mendapatkan semua Fish Types
export const getAllFishTypes = async (req, res) => {
  try {
    const fishTypes = await FishType.findAll();
    return res.success("Berhasil mengambil data jenis ikan", fishTypes);
  } catch (error) {
    return res.fail("Gagal mengambil data jenis ikan", error, 500);
  }
};

// Fungsi untuk mendapatkan Fish Type berdasarkan ID
export const getFishTypeById = async (req, res) => {
  try {
    const fishType = await FishType.findByPk(req.params.id);
    if (!fishType) {
      return res.fail("Jenis ikan tidak ditemukan", null, 404);
    }
    return res.success("Berhasil mengambil data jenis ikan", fishType);
  } catch (error) {
    return res.fail("Gagal mengambil data jenis ikan", error, 500);
  }
};

// Fungsi untuk mendapatkan Fish Type berdasarkan nama ikan
export const getFishTypeByName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.fail("Nama ikan diperlukan", null, 400);
    }

    const fishType = await FishType.findOne({
      where: { name },
    });

    if (!fishType) {
      return res.fail("Jenis ikan tidak ditemukan", null, 404);
    }

    return res.success("Berhasil mengambil data jenis ikan", fishType);
  } catch (error) {
    return res.fail("Gagal mengambil data jenis ikan", error, 500);
  }
};