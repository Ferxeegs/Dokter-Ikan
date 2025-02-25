import Payment from '../models/PaymentModel.js';
import Prescription from '../models/PrescriptionModel.js';
import Consultation from '../models/ConsultationModel.js'; // Relasi ke Consultation

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
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pembayaran', error: error.message });
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
      return res.status(404).json({ message: 'Data pembayaran tidak ditemukan' });
    }

    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Gagal mengambil data pembayaran', error: error.message });
  }
};

// Menambahkan pembayaran baru
export const createPayment = async (req, res) => {
  try {
    const { consultation_id, prescription_id, total_fee, payment_status } = req.body;

    // Validasi input
    if (!consultation_id || !total_fee) {
      return res.status(400).json({ message: 'Harap isi semua data yang diperlukan' });
    }

    const newPayment = await Payment.create({
      consultation_id,
      prescription_id: prescription_id || null, // Izinkan prescription_id menjadi null
      total_fee,
      payment_status: payment_status || 'pending' // Default pending jika tidak diisi
    });

    res.status(201).json({ message: 'Pembayaran berhasil ditambahkan', data: newPayment });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menambahkan pembayaran', error: error.message });
  }
};

// Memperbarui pembayaran
export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_method, payment_proof } = req.body;

    const payment = await Payment.findByPk(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.payment_method = payment_method;
    payment.payment_proof = payment_proof;
    await payment.save();

    res.status(200).json({ message: 'Payment updated successfully', payment });
  } catch (error) {
    console.error('Error updating payment:', error); // Tambahkan log error
    res.status(500).json({ message: 'Error updating payment', error });
  }
};


export const getPaymentByConsultationId = async (req, res) => {
  try {
    const { consultation_id } = req.query;
    
    if (!consultation_id) {
      return res.status(400).json({ error: "consultation_id is required" });
    }

    // Cari pembayaran berdasarkan consultation_id
    const payment = await Payment.findOne({
      where: { consultation_id },
      attributes: ["payment_id"], // Hanya ambil payment_id
    });

    if (!payment) {
      return res.status(404).json({ error: "Payment not found for this consultation" });
    }

    res.json({ payment_id: payment.payment_id });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Menghapus pembayaran berdasarkan ID
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Data pembayaran tidak ditemukan' });
    }

    await payment.destroy();
    res.status(200).json({ message: 'Data pembayaran berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal menghapus data pembayaran', error: error.message });
  }
};
