import React, { useEffect, useState } from 'react';

// Menentukan tipe untuk props
interface DetailResepProps {
  isOpen: boolean;
  toggleModal: () => void;
  consultationId: string; // Terima consultationId dari props
}

interface Medicine {
  title: string;
  content: string;
  dose: string;
  image: string;
}

const DetailResep: React.FC<DetailResepProps> = ({ isOpen, toggleModal, consultationId }) => {
  const [prescriptionData, setPrescriptionData] = useState<Medicine[]>([]); // Menyimpan data obat
  const [instruction, setInstruction] = useState<string>(''); // Menyimpan instruction
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    if (isOpen && consultationId) {
      fetch(`${API_BASE_URL}/prescriptionsbyconsultation?consultation_id=${consultationId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched prescription data:', data);
          setInstruction(data.instruction || ''); // Simpan instruction
          setPrescriptionData(Array.isArray(data.medicines) ? data.medicines : []); // Simpan obat
        })
        .catch((error) => console.error('Error fetching prescription data:', error));
    }
  }, [isOpen, consultationId]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={toggleModal}
    >
      <div
        className="bg-white p-6 rounded-2xl w-[90%] md:w-[40%] relative overflow-y-auto max-h-[80vh] flex flex-col shadow-lg transform transition-transform duration-300 scale-100"
        onClick={(e) => e.stopPropagation()} // Mencegah klik dalam modal menutupnya
      >
        {/* Header */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-4">🩺 Resep Obat dari Tenaga Ahli</h2>

        {/* Instruction */}
        {instruction && (
          <div className="bg-blue-100 p-4 rounded-lg mb-4 shadow-md flex items-start gap-3">
            <span className="text-blue-600 text-xl">📌</span>
            <div>
              <h3 className="font-semibold text-blue-800">Instruksi Penggunaan</h3>
              <p className="text-gray-700 text-sm">{instruction}</p>
            </div>
          </div>
        )}

        {/* Daftar Obat */}
        <div className="font-sans space-y-4 mb-6">
          {prescriptionData.length > 0 ? (
            prescriptionData.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-gradient-to-r from-[#DCF5FF] to-[#80B7F5] rounded-lg shadow hover:scale-105 transition-transform duration-300"
              >
                {/* Gambar Obat */}
                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <span className="text-xs text-gray-500 text-center">Gambar Tidak Tersedia</span>
                  )}
                </div>

                {/* Detail Obat */}
                <div className="ml-4 flex flex-col justify-center">
                  <h3 className="font-bold text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-700">{item.content}</p>
                  <p className="text-sm font-semibold text-gray-800">{item.dose}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-700">Tidak ada resep untuk konsultasi ini.</p>
          )}
        </div>

        {/* Tombol Tutup */}
        <button
          className="absolute top-2 right-2 text-gray-700 font-bold text-2xl hover:text-red-500 transition-colors"
          onClick={toggleModal}
        >
          &times;
        </button>

        {/* Tombol Pembayaran */}
        <button
          onClick={toggleModal}
          className="text-center mt-auto bg-blue-500 text-white py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
        >
          Ke menu pembayaran
        </button>
      </div>
    </div>
  );
};

export default DetailResep;
