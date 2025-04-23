'use client';

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import PaymentModal from "../components/modals/ModalPayment";

interface Medicine {
  title: string;
  price: number;
}

interface PaymentData {
  userName: string;
  expertName: string;
  medicines: Medicine[];
  dateTime: string;
  totalFee: number;
  chatEnabled: boolean;
  shippingFee: number;
}

const Payment = () => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const consultationId = searchParams.get("consultation_id");
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (!consultationId || !API_BASE_URL) return;

    const controller = new AbortController();
    const signal = controller.signal;
    let isMounted = true;

    const fetchPaymentData = async () => {
      setLoading(true);
      setError(null);
      try {
        const consultationResponse = await fetch(`${API_BASE_URL}/consultations/${consultationId}`, { signal });
        if (!consultationResponse.ok) throw new Error("Gagal mengambil data konsultasi.");
        const consultationData = await consultationResponse.json();

        const prescriptionResponse = await fetch(`${API_BASE_URL}/prescriptionsbyconsultation?consultation_id=${consultationId}`, { signal });
        const prescriptionData = prescriptionResponse.ok ? await prescriptionResponse.json() : null;

        const paymentLookupResponse = await fetch(`${API_BASE_URL}/paymentsbyconsultation?consultation_id=${consultationId}`, { signal });
        if (!paymentLookupResponse.ok) throw new Error("Gagal mengambil data ID pembayaran.");
        const paymentLookupData = await paymentLookupResponse.json();

        if (!paymentLookupData || !paymentLookupData.payment_id) {
          throw new Error("ID pembayaran tidak ditemukan.");
        }

        const paymentId = paymentLookupData.payment_id;

        const paymentResponse = await fetch(`${API_BASE_URL}/payments/${paymentId}`, { signal });
        if (!paymentResponse.ok) throw new Error("Gagal mengambil data pembayaran.");
        const paymentDetail = await paymentResponse.json();

        const formattedDateTime = paymentDetail?.createdAt
          ? new Date(paymentDetail.createdAt).toLocaleString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })
          : "Waktu Tidak Diketahui";

        if (isMounted) {
          setPaymentData({
            userName: consultationData?.name || "Nama Tidak Diketahui",
            expertName: consultationData?.fish_expert_name || "Expert Tidak Diketahui",
            medicines: Array.isArray(prescriptionData?.medicines) ? prescriptionData.medicines : [],
            dateTime: formattedDateTime,
            totalFee: (paymentDetail?.total_fee || 0),
            chatEnabled: consultationData?.chat_enabled || false,
            shippingFee: paymentDetail?.shipping_fee || 0,
          });
        }
      } catch (error) {
        if (isMounted) {
          setError(error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPaymentData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [consultationId, API_BASE_URL]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen text-xl font-semibold text-blue-600">Memuat data pembayaran...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-screen text-xl font-semibold text-red-600">{error}</div>;
  }

  if (!paymentData) {
    return <div className="flex items-center justify-center h-screen text-xl font-semibold text-blue-900">Data pembayaran tidak ditemukan.</div>;
  }

  const isShippingFeeValid = paymentData.shippingFee > 0;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-300 to-blue-100">
      <Navbar />
      <main className="flex flex-col items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-blue-400">
          <h2 className="text-xl sm:text-2xl font-extrabold text-blue-700 mb-6 text-center">Ringkasan Pembayaran</h2>

          <div className="text-sm sm:text-base space-y-1 text-gray-700">
            <p><strong>Nama User:</strong> {paymentData.userName}</p>
            <p><strong>Nama Expert:</strong> {paymentData.expertName}</p>
            <p><strong>Tanggal & Jam:</strong> {paymentData.dateTime}</p>
          </div>

          <hr className="my-4 border-blue-300" />

          <div className="text-sm sm:text-lg">
            <h3 className="font-semibold text-blue-600">Daftar Obat</h3>
            <ul className="bg-blue-50 p-4 rounded-lg mt-2">
              {paymentData.medicines.length > 0 ? (
                paymentData.medicines.map((med, index) => (
                  <li key={index} className="flex justify-between py-3 border-b last:border-none text-gray-800">
                    <span>{med.title}</span>
                    <span className="font-semibold text-blue-600">Rp {med.price.toLocaleString()}</span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 italic">Tidak ada obat dalam resep ini.</p>
              )}
            </ul>

            <h3 className="font-semibold text-blue-600 mt-4">Biaya Tambahan</h3>
            <ul className="bg-blue-50 p-4 rounded-lg mt-2">
              <li className="flex justify-between py-3 border-b last:border-none text-gray-800">
                <span>Biaya Konsultasi</span>
                <span className="font-semibold text-blue-600">Rp 50.000</span>
              </li>
              {paymentData.chatEnabled && (
                <li className="flex justify-between py-3 border-b last:border-none text-gray-800">
                  <span>Biaya Fitur Chat</span>
                  <span className="font-semibold text-blue-600">Rp 25.000</span>
                </li>
              )}
              <li className="flex justify-between py-3 border-b last:border-none text-gray-800">
                <span>Biaya Pengiriman</span>
                <span className="font-semibold text-blue-600">Rp {paymentData.shippingFee.toLocaleString()}</span>
              </li>
            </ul>
          </div>

          <hr className="my-6 border-blue-400" />

          <h3 className="text-lg sm:text-xl font-bold text-blue-800 text-center bg-blue-100 py-3 rounded-lg shadow-inner">
            Total Biaya: Rp {paymentData.totalFee.toLocaleString()}
          </h3>

          {!isShippingFeeValid && (
            <p className="text-center text-red-500 mt-4">Biaya pengiriman belum ditentukan. Silakan hubungi admin.</p>
          )}

          <button
            onClick={() => setModalOpen(true)}
            className={`mt-6 w-full py-3 bg-blue-500 text-white font-semibold rounded-xl shadow-md transition hover:bg-blue-600 hover:scale-105 ${!isShippingFeeValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isShippingFeeValid}
          >
            Pilih Metode Pembayaran
          </button>
          {consultationId && (
            <PaymentModal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              consultationId={consultationId}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const PaymentPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Payment />
  </Suspense>
);

export default PaymentPage;