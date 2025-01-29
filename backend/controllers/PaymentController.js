import Payment from '../models/PaymentModel.js';
import Prescription from '../models/PrescriptionModel.js';
import User from '../models/UserModel.js';

// Fungsi untuk mendapatkan semua data pembayaran
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        { model: Prescription },
        { model: User }
      ]
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pembayaran', error });
  }
};

// Fungsi untuk mendapatkan data pembayaran berdasarkan ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        { model: Prescription },
        { model: User }
      ]
    });
    if (!payment) {
      return res.status(404).json({ message: 'Data pembayaran tidak ditemukan' });
    }
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pembayaran', error });
  }
};

// Fungsi untuk menambahkan pembayaran baru
export const createPayment = async (req, res) => {
  try {
    const {
      medical_prescription_id,
      user_id,
      medicine_fee,
      consultation_fee,
      total_fee,
      payment_status
    } = req.body;

    const newPayment = await Payment.create({
      medical_prescription_id,
      user_id,
      medicine_fee,
      consultation_fee,
      total_fee,
      payment_status
    });

    res.status(201).json({ message: 'Pembayaran berhasil ditambahkan', data: newPayment });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan pembayaran', error });
  }
};

// Fungsi untuk memperbarui data pembayaran berdasarkan ID
export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Data pembayaran tidak ditemukan' });
    }

    await payment.update(req.body);
    res.status(200).json({ message: 'Data pembayaran berhasil diperbarui', data: payment });
  } catch (error) {
    res.status(500).json({ message: 'Gagal memperbarui data pembayaran', error });
  }
};

// Fungsi untuk menghapus data pembayaran berdasarkan ID
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Data pembayaran tidak ditemukan' });
    }

    await payment.destroy();
    res.status(200).json({ message: 'Data pembayaran berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data pembayaran', error });
  }
};
