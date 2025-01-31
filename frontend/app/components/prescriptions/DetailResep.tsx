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
}

const DetailResep: React.FC<DetailResepProps> = ({ isOpen, toggleModal, consultationId }) => {
  const [prescriptionData, setPrescriptionData] = useState<Medicine[]>([]); // Menyimpan data resep

  useEffect(() => {
    if (isOpen && consultationId) {
      // Ambil data resep berdasarkan consultationId
      fetch(`http://localhost:9000/prescriptionsbyconsultation?consultation_id=${consultationId}`)
        .then((response) => response.json())
        .then((data) => {
          // Pastikan data.medicines ada dan merupakan array
          if (data && Array.isArray(data.medicines)) {
            setPrescriptionData(data.medicines); // Simpan data resep ke state
          } else {
            setPrescriptionData([]); // Set empty jika tidak ada data medic
          }
          console.log('Fetched prescription data:', data); // Log untuk memverifikasi
        })
        .catch((error) => console.error('Error fetching prescription data:', error));
    }
  }, [isOpen, consultationId]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ${isOpen ? '' : 'hidden'}`}
      onClick={toggleModal}
    >
      <div
        className="bg-white p-6 rounded-xl w-[90%] md:w-[40%] relative overflow-y-auto max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} // Mencegah klik di dalam modal untuk menutupnya
      >
        <h2 className="text-lg font-bold font-sans text-black mb-4 text-center">
          Resep Obat dari Tenaga Ahli
        </h2>
        <div className="font-sans space-y-4 mb-6">
          {prescriptionData.length > 0 ? (
            // Jika ada data resep, tampilkan di dalam card
            prescriptionData.map((item, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-gradient-to-r from-[#DCF5FF] to-[#80B7F5] rounded-lg shadow"
              >
                {/* Jika ada gambar untuk obat, pastikan ini valid */}
                <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                  {/* Gambar obat bisa ditambahkan jika ada URL */}
                  <span className="text-sm text-gray-500">Gambar</span>
                </div>
                <div className="ml-4">
                  <h3 className="font-bold text-black">{item.title}</h3>
                  <p className="text-sm text-gray-700">{item.content}</p>
                  <p className="text-sm text-gray-700">{item.dose}</p>
                </div>
              </div>
            ))
          ) : (
            // Jika tidak ada data resep, tampilkan pesan
            <p className="text-center text-gray-700">Tidak ada resep untuk konsultasi ini.</p>
          )}
        </div>

        {/* Tombol Tutup */}
        <button
          className="absolute top-2 right-2 text-black font-bold text-lg"
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
