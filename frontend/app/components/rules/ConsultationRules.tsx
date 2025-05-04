'use client'

import { useState } from "react";
import { Info } from "lucide-react";


const ConsultationRules: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="text-center">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationRules;