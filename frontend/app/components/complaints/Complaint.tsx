import React, { useState } from 'react';
import Image from 'next/image';

interface ComplaintProps {
  title: string;
  description: string;
  fishType: string;
  fishLength: string;
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
  fishAge,
  fishImageUrls = [],
  senderName,
  consultationDate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fungsi untuk membuka modal dan menampilkan gambar yang dipilih
  const openModal = (image: string) => {
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
  

  // Fungsi untuk menutup modal jika klik di luar gambar
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[40%] h-auto border-4 border-[#1A83FB] overflow-y-auto relative">
      <h3 className="text-xl font-bold text-black mb-4 text-center">
        {title || 'Judul keluhan akan muncul di sini'}
      </h3>

      <div className="text-sm text-gray-700 mb-4">
        <p><strong>Jenis Ikan:</strong> {fishType || 'Jenis ikan belum diisi'}</p>
        <p><strong>Umur Ikan:</strong> {fishAge ? `${fishAge} bulan` : 'Umur ikan belum diisi'}</p>
        <p><strong>Panjang Ikan:</strong> {fishLength ? `${fishLength} cm` : 'Panjang ikan belum diisi'}</p>
      </div>
      <p className="text-sm text-gray-700 text-justify mb-4">
        {description || 'Deskripsi akan muncul di sini setelah Anda mengirimkan keluhan.'}
      </p>
      <div className="flex space-x-2">
        {fishImageUrls.length > 0 ? (
          fishImageUrls.map((url, index) => (
            <div key={index} className="w-24 h-24 relative">
              <Image
                src={url}
                alt={`Fish Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg cursor-pointer"
                onClick={() => openModal(url)} 
                unoptimized={true}
              />
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500"></p>
        )}
      </div>

      {/* Nama Pengirim dan Tanggal Konsultasi di Pojok Kanan Bawah */}
      <div className="absolute bottom-4 right-4 text-right font-sans">
        <span className="text-sm font-bold text-black">{senderName || 'Pengirim'}</span>
        <span className="block text-xs text-gray-600">{formattedDate || 'Tanggal Konsultasi'}</span>
      </div>

      {/* Modal untuk menampilkan gambar yang diperbesar */}
      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleOverlayClick} // Menutup modal jika klik di luar gambar
        >
          <div className="relative bg-white p-4 rounded-lg">
            <span
              onClick={closeModal}
              className="absolute top-0 right-0 p-2 cursor-pointer text-black font-bold"
            >
              X
            </span>
            <div className="relative max-w-[80vw] max-h-[80vh]">
              <Image
                src={selectedImage}
                alt="Selected Fish"
                layout="fill"
                objectFit="contain"
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Complaint;