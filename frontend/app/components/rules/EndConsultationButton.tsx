'use client'

import { useState, useEffect } from "react";
import { XCircle, Loader, CheckCircle, AlertCircle, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

interface EndConsultationButtonProps {
  consultationId: string;
  onEndSession: () => void;
}

const EndConsultationButton: React.FC<EndConsultationButtonProps> = ({ consultationId, onEndSession }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);
  const [hasPayment, setHasPayment] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null
  });
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  // Cek apakah consultation_id sudah ada di tabel payment
  useEffect(() => {
    const token = Cookies.get('token');
    const checkPaymentStatus = async () => {
      if (!consultationId || !API_BASE_URL) return;
      
      setIsCheckingPayment(true);
      try {
        const paymentLookupResponse = await fetch(`${API_BASE_URL}/paymentsbyconsultation?consultation_id=${consultationId}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Sertakan token di header
        },
      });
        const paymentLookupData = await paymentLookupResponse.json();

        if (
          paymentLookupResponse.ok &&
          paymentLookupData.success &&
          paymentLookupData.message !== "Payment not found for this consultation"
        ) {
          // Jika pembayaran ditemukan
          setHasPayment(true);
        } else {
          // Jika belum ada pembayaran
          setHasPayment(false);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setHasPayment(false);
      } finally {
        setIsCheckingPayment(false);
      }
    };

    checkPaymentStatus();
  }, [consultationId, API_BASE_URL]);

  const closeNotification = () => {
    setNotification({ message: '', type: null });
  };

  const handlePaymentSummary = () => {
    // Redirect ke halaman pembayaran/ringkasan
    router.push(`/payment?consultation_id=${consultationId}`);
  };

  const endConsultation = async () => {
  setIsLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}/end`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: 'include', // ⬅️ Kirim cookie HttpOnly ke server
    });

    if (!response.ok) {
      throw new Error("Gagal mengakhiri sesi konsultasi");
    }

    setNotification({ message: "Sesi konsultasi telah berakhir.", type: "success" });

    // 🔹 Reload halaman setelah 3 detik
    setTimeout(() => {
      window.location.reload();
    }, 3000);

    onEndSession(); // 🔹 Callback jika ada proses lain
  } catch (error) {
    console.error("Error:", error);
    setNotification({
      message: "Terjadi kesalahan saat mengakhiri sesi konsultasi.",
      type: "error",
    });
  } finally {
    setIsLoading(false);
  }
};

  // Tampilkan loading saat mengecek status pembayaran
  if (isCheckingPayment) {
    return (
      <button 
        disabled 
        className="px-4 py-2 flex items-center gap-2 bg-gray-400 text-white rounded-lg shadow-md cursor-not-allowed"
      >
        <Loader className="w-5 h-5 animate-spin" />
        Mengecek Status...
      </button>
    );
  }

  return (
    <>
      {hasPayment ? (
        // Tombol untuk ke ringkasan pembayaran
        <button
          onClick={handlePaymentSummary}
          className="px-4 py-2 flex items-center gap-2 bg-green-500 text-white rounded-lg shadow-md transition-all hover:bg-green-600 hover:scale-105"
        >
          <CreditCard className="w-5 h-5" />
          Ke Ringkasan Pembayaran
        </button>
      ) : (
        // Tombol untuk mengakhiri konsultasi
        <button
          onClick={endConsultation}
          disabled={isLoading}
          className={`px-4 py-2 flex items-center gap-2 bg-red-500 text-white rounded-lg shadow-md transition-all ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600 hover:scale-105"
          }`}
        >
          {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
          {isLoading ? "Mengakhiri..." : "Akhiri Konsultasi"}
        </button>
      )}

      {/* Modal Notifikasi */}
      {notification.type && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-20">
          <div className={`p-6 rounded-lg shadow-lg max-w-sm text-center transition-all duration-300 ${
            notification.type === "success" ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"
          } border-l-4`}>
            <div className="flex items-center justify-center gap-3">
              {notification.type === "success" ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-500" />
              )}
              <h2 className="text-lg font-semibold text-gray-800">
                {notification.type === "success" ? "Berhasil" : "Gagal"}
              </h2>
            </div>
            <p className="text-sm text-gray-700 mt-2">{notification.message}</p>
            <button
              onClick={closeNotification}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EndConsultationButton;