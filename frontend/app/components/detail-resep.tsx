import React from 'react';

// Menentukan tipe untuk props
interface DetailResepProps {
  isOpen: boolean;
  toggleModal: () => void;
}

const DetailResep: React.FC<DetailResepProps> = ({ isOpen, toggleModal }) => {
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
          {/* Card Obat */}
          {[
            {
              title: 'Antibiotik',
              content: 'Kandungan: Amoxicillin',
              usage: 'Campurkan dengan air selama 7 hari.',
              dose: 'Takaran: 10mg/L air',
            },
            {
              title: 'Antijamur',
              content: 'Kandungan: Methylene Blue',
              usage: 'Rendam ikan selama 10 menit.',
              dose: 'Takaran: 5ml/L air',
            },
            {
              title: 'Vitamin',
              content: 'Kandungan: Multivitamin Kompleks',
              usage: 'Campurkan ke pakan setiap hari.',
              dose: 'Takaran: 1 tablet/10kg ikan',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center p-4 bg-gradient-to-r from-[#DCF5FF] to-[#80B7F5] rounded-lg shadow"
            >
              <img
                src="https://via.placeholder.com/100"
                alt={`Obat ${index + 1}`}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="ml-4">
                <h3 className="font-bold text-black">{item.title}</h3>
                <p className="text-sm text-gray-700">{item.content}</p>
                <p className="text-sm text-gray-700">{item.dose}</p>
                <p className="text-sm text-gray-700">{item.usage}</p>
              </div>
            </div>
          ))}
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
