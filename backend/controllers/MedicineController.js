import Medicine from "../models/MedicineModel.js";

// Fungsi untuk mendapatkan semua data obat
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.findAll();
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data obat', error });
  }
};

// Fungsi untuk mendapatkan data obat berdasarkan ID
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Obat tidak ditemukan' });
    }
    res.status(200).json(medicine);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data obat', error });
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
      medicine_image
    } = req.body;

    // Membuat data baru di tabel Medicine
    const newMedicine = await Medicine.create({
      vendor_id,
      medicine_name,
      contain,
      dosage,
      medicine_image
    });

    // Mengirim respons jika berhasil
    res.status(201).json({
      message: 'Obat berhasil ditambahkan',
      data: newMedicine
    });
  } catch (error) {
    // Mengirim respons jika terjadi error
    res.status(500).json({
      message: 'Gagal menambahkan obat',
      error: error.message
    });
  }
};

// Fungsi untuk memperbarui data obat
export const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Obat tidak ditemukan' });
    }

    const {
      vendor_id,
      medicine_name,
      contain,
      dosage,
      medicine_image
    } = req.body;

    await medicine.update({
      vendor_id,
      medicine_name,
      contain,
      dosage,
      medicine_image
    });

    res.status(200).json({
      message: 'Obat berhasil diperbarui',
      data: medicine
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui obat', error });
  }
};

// Fungsi untuk menghapus data obat
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByPk(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: 'Obat tidak ditemukan' });
    }

    await medicine.destroy();
    res.status(200).json({ message: 'Obat berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus obat', error });
  }
};
