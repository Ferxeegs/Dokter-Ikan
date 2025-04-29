import React from 'react';
import { useRouter } from 'next/navigation';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    router.push('/'); 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-4">Berhasil!</h2>
        <p className="text-gray-700 text-center mb-4">Bukti pembayaran berhasil dikirim dan akan segera diproses.</p>
        <button
          onClick={handleClose}
          className="w-full py-3 mt-4 text-white font-semibold rounded-lg bg-green-600 hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;