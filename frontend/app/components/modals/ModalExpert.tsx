    import React from "react";
import { useRouter } from "next/navigation";

interface ModalExpertProps {
  message: string;
  onClose: () => void;
}

const ModalExpert: React.FC<ModalExpertProps> = ({ message, onClose }) => {
  const router = useRouter();
  
  const handleClose = () => {
    onClose();
    router.push('/expertpage');
  };

  const handleViewHistory = () => {
    onClose();
    router.push('/riwayatexpert');
  };

  // Check if this is a success message (answer sent successfully)
  const isSuccessMessage = message.toLowerCase().includes('berhasil') || 
                          message.toLowerCase().includes('success') ||
                          message.toLowerCase().includes('jawaban berhasil dikirim');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] animate-fadeIn">
      <div className="bg-white rounded-2xl p-8 mx-4 max-w-md w-full shadow-2xl transform animate-scaleIn">
        <div className="text-center">
          {/* Icon based on message type */}
          <div className="mb-6">
            <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center ${
              isSuccessMessage 
                ? 'bg-green-100' 
                : 'bg-blue-100'
            }`}>
              {isSuccessMessage ? (
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className={`text-xl font-bold mb-4 ${
            isSuccessMessage ? 'text-green-600' : 'text-blue-600'
          }`}>
            {isSuccessMessage ? 'Jawaban Berhasil Dikirim!' : 'Informasi'}
          </h3>

          {/* Message */}
          <p className="text-gray-700 mb-6 leading-relaxed">
            {message}
          </p>

          {/* Additional info for success messages */}
          {isSuccessMessage && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 text-left">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Tips:</strong> Jawaban Anda telah berhasil dikirim kepada klien. Anda dapat melihat riwayat konsultasi dan melanjutkan chat dengan klien di halaman <strong>Riwayat Expert</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {isSuccessMessage && (
              <button
                onClick={handleViewHistory}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Lihat Riwayat</span>
                </div>
              </button>
            )}
            <button
              onClick={handleClose}
              className={`flex-1 font-semibold py-3 px-6 rounded-xl transition duration-300 transform hover:scale-105 shadow-lg ${
                isSuccessMessage 
                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-800' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
              }`}
            >
              {isSuccessMessage ? 'Kembali ke Beranda' : 'OK'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ModalExpert;