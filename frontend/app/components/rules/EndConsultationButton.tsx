'use client'

import { useState } from "react";
import { XCircle, Loader, CheckCircle, AlertCircle } from "lucide-react";
import Cookies from 'js-cookie';

interface EndConsultationButtonProps {
  consultationId: string;
  onEndSession: () => void;
}

const EndConsultationButton: React.FC<EndConsultationButtonProps> = ({ consultationId, onEndSession }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null
  });
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const closeNotification = () => {
    setNotification({ message: '', type: null });
  };

  const endConsultation = async () => {
    const token = Cookies.get('token');
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/consultations/${consultationId}/end`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengakhiri sesi konsultasi");
      }

      setNotification({ message: "Sesi konsultasi telah berakhir.", type: "success" });

      // 🔹 Setelah 3 detik, reload halaman
      setTimeout(() => {
        window.location.reload();
      }, 3000);

      onEndSession();
    } catch (error) {
      console.error("Error:", error);
      setNotification({ message: "Terjadi kesalahan saat mengakhiri sesi konsultasi.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
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