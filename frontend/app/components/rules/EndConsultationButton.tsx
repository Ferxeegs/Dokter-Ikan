'use client'

import { useState, useEffect } from "react";
import { XCircle, Loader, CheckCircle, AlertCircle, CreditCard, Info } from "lucide-react";
import { useRouter } from "next/navigation";

interface EndConsultationButtonProps {
  consultationId: string;
  onEndSession: () => void;
}

const EndConsultationButton: React.FC<EndConsultationButtonProps> = ({ consultationId, onEndSession }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [hasPayment, setHasPayment] = useState(false);
  const [consultationStatus, setConsultationStatus] = useState<'active' | 'closed'>('active');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null
  });
  
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  // Cek status pembayaran dan konsultasi dari server
  useEffect(() => {
    const checkStatus = async () => {
      if (!consultationId || !API_BASE_URL) return;
      
      setIsCheckingStatus(true);
      try {
        // Cek status konsultasi menggunakan endpoint baru
        const consultationResponse = await fetch(`${API_BASE_URL}/consultations/${consultationId}/status`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const consultationData = await consultationResponse.json();

        if (consultationResponse.ok && consultationData.success) {
          // Set status berdasarkan response dari API
          setConsultationStatus(consultationData.data.is_closed ? 'closed' : 'active');
        } else {
          console.error("Error fetching consultation status:", consultationData.message);
          setConsultationStatus('active'); // Default ke active jika error
        }

        // Cek status pembayaran hanya jika konsultasi masih aktif atau sudah ditutup
        const paymentResponse = await fetch(`${API_BASE_URL}/paymentsbyconsultation?consultation_id=${consultationId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const paymentData = await paymentResponse.json();

        if (
          paymentResponse.ok &&
          paymentData.success &&
          paymentData.message !== "Payment not found for this consultation"
        ) {
          setHasPayment(true);
        } else {
          setHasPayment(false);
        }

      } catch (error) {
        console.error("Error checking status:", error);
        setHasPayment(false);
        setConsultationStatus('active'); // Default ke active jika error
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkStatus();

    // Optional: Set interval untuk auto-refresh status setiap 30 detik
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, [consultationId, API_BASE_URL]);

  const closeNotification = () => {
    setNotification({ message: '', type: null });
  };

  const handlePaymentSummary = () => {
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
        credentials: 'include',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || "Gagal mengakhiri sesi konsultasi");
      }

      setNotification({ message: "Sesi konsultasi telah berakhir.", type: "success" });
      setConsultationStatus('closed'); // Update status lokal
      onEndSession();
      
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat mengakhiri sesi konsultasi.";
      setNotification({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Tampilkan loading awal
  if (isCheckingStatus) {
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

  // Logika tampilan berdasarkan kondisi
  const renderButton = () => {
    // 1. Jika sudah ada pembayaran - tampilkan tombol ke ringkasan pembayaran
    if (hasPayment) {
      return (
        <button
          onClick={handlePaymentSummary}
          className="px-4 py-2 flex items-center gap-2 bg-green-500 text-white rounded-lg shadow-md transition-all hover:bg-green-600 hover:scale-105"
        >
          <CreditCard className="w-5 h-5" />
          Ke Ringkasan Pembayaran
        </button>
      );
    }

    // 2. Jika konsultasi sudah ditutup tapi belum ada pembayaran - tampilkan keterangan
    if (consultationStatus === 'closed') {
      return (
        <div className="px-4 py-2 flex items-center gap-2 bg-gray-100 text-gray-700 rounded-lg shadow-md border border-gray-300">
          <Info className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium">Konsultasi sudah ditutup</span>
        </div>
      );
    }

    // 3. Jika konsultasi masih aktif dan belum ada pembayaran - tampilkan tombol akhiri
    return (
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
    );
  };

  return (
    <>
      {renderButton()}

      {/* Modal Notifikasi */}
      {notification.type && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-20">
          <div className={`p-6 rounded-lg shadow-lg max-w-sm text-center transition-all duration-300 ${
            notification.type === "success" ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"
          } border-l-4`}>
            <div className="flex items-center justify-center gap-3">
              {notification.type === "success" ? <CheckCircle className="w-6 h-6 text-green-500" /> : <AlertCircle className="w-6 h-6 text-red-500" />}
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