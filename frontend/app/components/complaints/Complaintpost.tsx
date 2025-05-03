import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface ComplaintProps {
  title: string;
  description: string;
  fishType: string;
  fishLength: string;
  fishWeight: string;
  fishAge: string;
  fishImageUrls?: string[]; // Optional to avoid undefined
}

const ComplaintPost: React.FC<ComplaintProps> = ({
  title,
  description,
  fishType,
  fishLength,
  fishWeight,
  fishAge,
  fishImageUrls = [], // Default empty array
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fungsi untuk membuka lightbox
  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden'; // Nonaktifkan scroll saat lightbox terbuka
  };

  // Fungsi untuk menutup lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto'; // Aktifkan kembali scroll saat lightbox tertutup
  };

  // Fungsi untuk navigasi ke gambar sebelumnya
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? fishImageUrls.length - 1 : prevIndex - 1
    );
  };

  // Fungsi untuk navigasi ke gambar berikutnya
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === fishImageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Tambahkan keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto'; // Pastikan scroll diaktifkan kembali saat komponen unmount
    };
  }, [lightboxOpen]);

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[40%] h-auto border-4 border-[#1A83FB] overflow-y-auto">
      <h3 className="text-lg md:text-xl font-bold text-black mb-4 text-center">
        {title || 'Judul keluhan akan muncul di sini'}
      </h3>

      <div className="text-sm text-gray-700 mb-4 text-justify">
        <p><strong>Jenis Ikan:</strong> {fishType || 'Jenis ikan belum diisi'}</p>
        <p><strong>Panjang Ikan:</strong> {fishLength ? `${fishLength} cm` : 'Panjang ikan belum diisi'}</p>
        <p><strong>Berat Ikan:</strong> {fishWeight ? `${fishWeight} g` : 'Berat ikan belum diisi'}</p>
        <p><strong>Umur Ikan:</strong> {fishAge ? `${fishAge} bulan` : 'Umur ikan belum diisi'}</p>
      </div>

      <p className="text-sm text-gray-700 text-justify mb-4">
        {description || 'Deskripsi akan muncul di sini setelah Anda mengirimkan keluhan.'}
      </p>

      {/* Thumbnail Gambar */}
      <div className="flex flex-wrap gap-2 mb-4">
        {fishImageUrls.length > 0 ? (
          fishImageUrls.map((url, index) => (
            <div
              key={index}
              className="w-20 h-20 sm:w-24 sm:h-24 relative cursor-pointer transition-transform hover:scale-105 hover:shadow-md rounded-lg overflow-hidden"
              onClick={() => openLightbox(index)}
            >
              <Image
                src={url}
                alt={`Fish Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                unoptimized
              />
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Tidak ada gambar ikan.</p>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && fishImageUrls.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center p-4">
          {/* Tombol Tutup */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700 transition-colors z-50"
            aria-label="Tutup lightbox"
          >
            ✕
          </button>

          {/* Gambar Utama */}
          <div className="relative w-full h-full max-w-4xl max-h-screen flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={fishImageUrls[currentImageIndex]}
                alt={`Gambar ikan ${currentImageIndex + 1}`}
                layout="fill"
                objectFit="contain"
                unoptimized
              />
            </div>

            {/* Navigasi Gambar */}
            {fishImageUrls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 sm:left-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-opacity"
                  aria-label="Gambar sebelumnya"
                >
                  ‹
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 sm:right-4 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-opacity"
                  aria-label="Gambar berikutnya"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Indikator Jumlah Gambar */}
          {fishImageUrls.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <span className="px-4 py-1 bg-black bg-opacity-50 rounded-full text-sm">
                {currentImageIndex + 1} / {fishImageUrls.length}
              </span>
            </div>
          )}

          {/* Mini Thumbnail Navigator */}
          {fishImageUrls.length > 1 && (
            <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto py-2">
              {fishImageUrls.map((url, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-12 h-12 relative cursor-pointer rounded-md overflow-hidden border-2 ${index === currentImageIndex ? 'border-blue-500' : 'border-transparent'
                    }`}
                >
                  <Image
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintPost;