'use client'

import { useState } from "react";
import { Info, XCircle, Loader, CheckCircle, AlertCircle } from "lucide-react";
import Cookies from 'js-cookie';

interface ConsultationRulesProps {
  consultationId: string;
  onEndSession: () => void;
}

const ConsultationRules: React.FC<ConsultationRulesProps> = ({ consultationId, onEndSession }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null
  });
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

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
      setIsOpen(false);
    } catch (error) {
      console.error("Error:", error);
      setNotification({ message: "Terjadi kesalahan saat mengakhiri sesi konsultasi.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center mt-6">
      <button
        onClick={toggleModal}
        className="flex items-center gap-2 px-3 py-2 bg-gray-500 text-white text-sm font-medium rounded-lg shadow-md border border-gray-600 transition-all duration-300 hover:bg-gray-800 hover:scale-105 hover:shadow-lg active:scale-95"
      >
        <Info className="w-4 h-4" /> Aturan Konsultasi
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-10 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg text-center transform transition-all duration-300 scale-95 hover:scale-100">
            <h2 className="text-xl font-semibold text-gray-800">📜 Aturan Konsultasi</h2>
            <ul className="text-sm text-gray-700 mt-4 text-left list-disc list-inside">
              <li>Konsultasi hanya untuk keperluan perikanan</li>
              <li>Tidak diperbolehkan berbagi informasi pribadi</li>
              <li>Konsultasi akan berakhir 3 jam setelah tenaga ahli memberikan jawaban konsultasi</li>
              <li>Anda dapat mengakhiri sesi konsultasi dengan menekan tombol akhiri</li>
              <li>Setelah sesi berakhir maka Anda tidak dapat menanyakan keluhan dan harus membuat konsultasi baru</li>
              <li>Gunakan bahasa yang sopan dan jelas</li>
            </ul>
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={toggleModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-transform transform hover:scale-105"
              >
                Tutup
              </button>
              <button
                onClick={endConsultation}
                disabled={isLoading}
                className={`px-4 py-2 flex items-center gap-2 bg-red-500 text-white rounded-lg shadow-md transition-all ${
                  isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600 hover:scale-110"
                }`}
              >
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                {isLoading ? "Mengakhiri..." : "Akhiri Konsultasi"}
              </button>
            </div>
          </div>
        </div>
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
    </div>
  );
};

export default ConsultationRules;
