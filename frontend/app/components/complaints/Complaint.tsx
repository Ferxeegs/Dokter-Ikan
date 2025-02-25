import React, { useState } from 'react';
import Image from 'next/image';

interface ComplaintProps {
  title: string;
  description: string;
  fishType: string;
  fishLength: string;
  fishWeight: string;
  fishAge: string;
  fishImageUrls?: string[]; // Opsional
  senderName: string; // Nama pengirim
  consultationDate: string; // Tanggal konsultasi
}

const Complaint: React.FC<ComplaintProps> = ({
  title,
  description,
  fishType,
  fishLength,
  fishWeight,
  fishAge,
  fishImageUrls = [],
  senderName,
  consultationDate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fungsi untuk membuka modal dan menampilkan gambar yang dipilih
  const openModal = (image: string) => {
    console.log("Gambar diklik:", image); // Debugging
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const formattedDate = new Intl.DateTimeFormat('id-ID', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    timeZoneName: 'short' 
  }).format(new Date(consultationDate));

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 w-full md:w-[40%] h-auto border-4 border-[#1A83FB] overflow-y-auto relative">
      <h3 className="text-lg sm:text-xl font-bold text-black mb-4 text-center">
        {title || 'Judul keluhan akan muncul di sini'}
      </h3>

      <div className="text-xs sm:text-sm text-gray-700 mb-4">
        <p><strong>Jenis Ikan:</strong> {fishType || 'Jenis ikan belum diisi'}</p>
        <p><strong>Umur Ikan:</strong> {fishAge ? `${fishAge} bulan` : 'Umur ikan belum diisi'}</p>
        <p><strong>Panjang Ikan:</strong> {fishLength ? `${fishLength} cm` : 'Panjang ikan belum diisi'}</p>
        <p><strong>Berat Ikan:</strong> {fishWeight ? `${fishWeight} g` : 'Berat ikan belum diisi'}</p>
      </div>
      <p className="text-xs sm:text-sm text-gray-700 text-justify mb-4">
        {description || 'Deskripsi akan muncul di sini setelah Anda mengirimkan keluhan.'}
      </p>

      {/* Menampilkan gambar-gambar kecil */}
      <div className="flex space-x-2 overflow-x-auto">
        {fishImageUrls.length > 0 ? (
          fishImageUrls.map((url, index) => (
            <div key={index} className="w-20 h-20 sm:w-24 sm:h-24 relative cursor-pointer">
              <Image
                src={url}
                alt={`Fish Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                onClick={() => openModal(url)}
                unoptimized
              />
            </div>
          ))
        ) : (
          <p className="text-xs sm:text-sm text-gray-500">Tidak ada gambar ikan.</p>
        )}
      </div>

      {/* Nama Pengirim dan Tanggal Konsultasi di Pojok Kanan Bawah */}
      <div className="absolute bottom-4 right-4 text-right font-sans">
        <span className="text-xs sm:text-sm font-bold text-black">{senderName || 'Pengirim'}</span>
        <span className="block text-xs text-gray-600">{formattedDate || 'Tanggal Konsultasi'}</span>
      </div>

      {/* Modal untuk menampilkan gambar yang diperbesar */}
      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              console.log("Klik di luar modal, menutup modal.");
              closeModal();
            }
          }}
        >
          <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-[80vw] max-h-[80vh] flex items-center justify-center">
            <button
              onClick={closeModal}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ✕
            </button>
            <div className="relative w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] flex items-center justify-center">
              <Image
                src={selectedImage}
                alt="Selected Fish"
                layout="fill"
                objectFit="contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaint;