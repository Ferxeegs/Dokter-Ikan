import Medicine from "../models/MedicineModel.js";
import "regenerator-runtime/runtime.js";

// Fungsi untuk mendapatkan semua data obat
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll();
    return res.success("Berhasil mengambil data obat", medicines);
  } catch (error) {
    return res.fail("Gagal mengambil data obat", error, 500);
  }
};

// Fungsi untuk mendapatkan data obat berdasarkan ID
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine) {
      return res.fail("Obat tidak ditemukan", null, 404);
    }
    return res.success("Berhasil mengambil data obat", medicine);
  } catch (error) {
    return res.fail("Gagal mengambil data obat", error, 500);
  }
};

// Fungsi untuk menambahkan obat baru
export const createMedicine = async (req, res) => {
  try {
    const {
      vendor_id,
      medicine_name,
      contain,
      dosage,
      price,
      medicine_image
    } = req.body;

    // Validasi harga harus angka positif
    if (price < 0) {
      return res.fail("Harga tidak boleh negatif");
    }

    // Membuat data baru di tabel Medicine
    const newMedicine = await Medicine.create({
      vendor_id,
      medicine_name,
      contain,
      dosage,
      price,
      medicine_image
    });

    // Mengirim respons jika berhasil
    return res.success("Obat berhasil ditambahkan", newMedicine);
  } catch (error) {
    // Mengirim respons jika terjadi error
    return res.fail("Gagal menambahkan obat", error.message, 500);
  }
};

// Fungsi untuk memperbarui data obat
export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine) {
      return res.fail("Obat tidak ditemukan", null, 404);
    }

    const {
      vendor_id,
      medicine_name,
      contain,
      dosage,
      price,
      medicine_image
    } = req.body;

    // Validasi harga tidak boleh negatif
    if (price < 0) {
      return res.fail("Harga tidak boleh negatif");
    }

    await medicine.update({
      vendor_id,
      medicine_name,
      contain,
      dosage,
      price,
      medicine_image
    });

    return res.success("Obat berhasil diperbarui", medicine);
  } catch (error) {
    return res.fail("Gagal memperbarui obat", error, 500);
  }
};

// Fungsi untuk menghapus data obat
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine) {
      return res.fail("Obat tidak ditemukan", null, 404);
    }

    await medicine.destroy();
    return res.success("Obat berhasil dihapus");
  } catch (error) {
    return res.fail("Gagal menghapus obat", error, 500);
  }
};