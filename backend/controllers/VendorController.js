import Vendor from "../models/VendorModel.js";

// Fungsi untuk mendapatkan semua vendor
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.findAll();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data vendor', error });
  }
};

// Fungsi untuk mendapatkan vendor berdasarkan ID
export const getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor tidak ditemukan' });
    }
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data vendor', error });
  }
};

// Fungsi untuk menambahkan vendor baru
export const createVendor = async (req, res) => {
  try {
    const { vendor_name, stock_information, vendor_address, contact } = req.body;
    const newVendor = await Vendor.create({ vendor_name, stock_information, vendor_address, contact });
    res.status(201).json({ message: 'Vendor berhasil ditambahkan', newVendor });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan vendor', error });
  }
};

// Fungsi untuk memperbarui data vendor
export const updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor tidak ditemukan' });
    }

    const { vendor_name, stock_information, vendor_address, contact } = req.body;
    await vendor.update({ vendor_name, stock_information, vendor_address, contact });

    res.status(200).json({ message: 'Vendor berhasil diperbarui', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui vendor', error });
  }
};

// Fungsi untuk menghapus vendor
export const deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor tidak ditemukan' });
    }

    await vendor.destroy();
    res.status(200).json({ message: 'Vendor berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus vendor', error });
  }
};
