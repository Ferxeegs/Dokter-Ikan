import React, { useState } from 'react';
import Image from 'next/image';

interface ComplaintProps {
  title: string;
  description: string;
  fishType: string;
  fishLength: string;
  fishWeight: string;
  fishAge: string;
  fishImageUrls?: string[]; // Jadikan opsional untuk menghindari undefined
}

const ComplaintPost: React.FC<ComplaintProps> = ({
  title,
  description,
  fishType,
  fishLength,
  fishWeight,
  fishAge,
  fishImageUrls = [], // Berikan default array kosong
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

  // Fungsi untuk menutup modal jika klik di luar gambar
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[40%] h-auto border-4 border-[#1A83FB] overflow-y-auto">
      <h3 className="text-xl font-bold text-black mb-4 text-center">
        {title || 'Judul keluhan akan muncul di sini'}
      </h3>

      <div className="text-sm text-gray-700 mb-4">
        <p><strong>Jenis Ikan:</strong> {fishType || 'Jenis ikan belum diisi'}</p>
        <p><strong>Panjang Ikan:</strong> {fishLength ? `${fishLength} cm` : 'Panjang ikan belum diisi'}</p>
        <p><strong>Berat Ikan:</strong> {fishWeight ? `${fishWeight} g` : 'Berat ikan belum diisi'}</p>
        <p><strong>Umur Ikan:</strong> {fishAge ? `${fishAge} bulan` : 'Umur ikan belum diisi'}</p>
      </div>
      <p className="text-sm text-gray-700 text-justify mb-4">
        {description || 'Deskripsi akan muncul di sini setelah Anda mengirimkan keluhan.'}
      </p>
      <div className="flex space-x-2">
        {fishImageUrls.length > 0 ? (
          fishImageUrls.map((url, index) => (
            <div key={index} className="w-24 h-24 relative">
              <Image
                src={`${API_BASE_URL}${url}`}
                alt={`Fish Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg cursor-pointer"
                onClick={() => openModal(`${API_BASE_URL}${url}`)} 
                unoptimized={true}
              />
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500"></p>
        )}
      </div>

      {/* Modal untuk menampilkan gambar yang diperbesar */}
      {isModalOpen && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={handleOverlayClick}
        >
          <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-[80vw] max-h-[80vh] flex items-center justify-center">
            <button
              onClick={closeModal}
              className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ✕
            </button>
            <div className="relative w-[600px] h-[600px] flex items-center justify-center">
              <Image
                src={selectedImage}
                alt="Selected Fish"
                width={600}
                height={600}
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

export default ComplaintPost;