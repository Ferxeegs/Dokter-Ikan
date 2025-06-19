import Payment from '../models/PaymentModel.js';
import Prescription from '../models/PrescriptionModel.js';
import Consultation from '../models/ConsultationModel.js';
import User from '../models/UserModel.js';
import UserConsultation from '../models/UserConsultationModel.js';
import "regenerator-runtime/runtime.js";

// Mendapatkan semua pembayaran
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Consultation, 
          attributes: ['consultation_id', 'user_id', 'fishExpert_id']
        },
        {
          model: Prescription,
          attributes: ['prescription_id', 'instruction']
        }
      ]
    });
    return res.success('Berhasil mengambil data pembayaran', payments);
  } catch (error) {
    return res.fail('Gagal mengambil data pembayaran', error.message, 500);
  }
};

// Mendapatkan pembayaran berdasarkan ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        {
          model: Consultation, 
          attributes: ['consultation_id', 'user_id', 'fishExpert_id']
        },
        {
          model: Prescription,
          attributes: ['prescription_id', 'instruction']
        }
      ]
    });

    if (!payment) {
      return res.fail('Data pembayaran tidak ditemukan', null, 404);
    }

    return res.success('Berhasil mengambil data pembayaran', payment);
  } catch (error) {
    return res.fail('Gagal mengambil data pembayaran', error.message, 500);
  }
};

// Menambahkan pembayaran baru
export const createPayment = async (req, res) => {
  try {
    const { consultation_id, prescription_id, total_fee, payment_status } = req.body;

    // Validasi input
    if (!consultation_id || !total_fee) {
      return res.fail('Harap isi semua data yang diperlukan');
    }

    const newPayment = await Payment.create({
      consultation_id,
      prescription_id: prescription_id || null, // Izinkan prescription_id menjadi null
      total_fee,
      payment_status: payment_status || 'pending' // Default pending jika tidak diisi
    });

    return res.success('Pembayaran berhasil ditambahkan', newPayment);
  } catch (error) {
    return res.fail('Gagal menambahkan pembayaran', error.message, 500);
  }
};

// Memperbarui pembayaran
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_method, payment_proof } = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.fail('Payment not found', null, 404);
    }

    // Update payment fields
    payment.payment_method = payment_method;
    payment.payment_proof = payment_proof;
    
    // Set payment status to pending when proof is uploaded
    if (payment_proof) {
      payment.payment_status = 'pending';
    }
    
    await payment.save();

    return res.success('Payment updated successfully', payment);
  } catch (error) {
    console.error('Error updating payment:', error); // Tambahkan log error
    return res.fail('Error updating payment', error, 500);
  }
};

export const getPaymentByConsultationId = async (req, res) => {
  try {
    const { consultation_id } = req.query;
    
    if (!consultation_id) {
      return res.fail('consultation_id is required');
    }

    // Cari pembayaran berdasarkan consultation_id
    const payment = await Payment.findOne({
      where: { consultation_id },
      attributes: ["payment_id"], // Hanya ambil payment_id
    });

    if (!payment) {
      return res.fail('Payment not found for this consultation', null, 404);
    }

    return res.success('Berhasil mengambil data payment ID', { payment_id: payment.payment_id });
  } catch (error) {
    console.error("Error fetching payment:", error);
    return res.fail('Internal Server Error', error, 500);
  }
};

// Menghapus pembayaran berdasarkan ID
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.fail('Data pembayaran tidak ditemukan', null, 404);
    }

    await payment.destroy();
    return res.success('Data pembayaran berhasil dihapus');
  } catch (error) {
    return res.fail('Gagal menghapus data pembayaran', error.message, 500);
  }
};

export const getPaymentHistoryByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Consultation,
          attributes: ["consultation_id", "user_id"],
          where: { user_id: userId },
          include: [
            {
              model: User,
              attributes: ["name"],
            },
            {
              model: UserConsultation,
              attributes: ["consultation_topic"],
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]],
      attributes: [
        "payment_id",
        "payment_method",
        "total_fee",
        "payment_status",
        "createdAt"
      ],
    });

    if (!payments || payments.length === 0) {
      return res.fail("Tidak ada riwayat pembayaran ditemukan.");
    }

    return res.success("Berhasil mengambil riwayat pembayaran", payments);
  } catch (error) {
    console.error(error);
    return res.fail("Terjadi kesalahan pada server", error.message, 500);
  }
};

