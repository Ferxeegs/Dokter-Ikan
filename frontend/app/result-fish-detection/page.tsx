'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useCallback, Suspense } from 'react';

// Definisikan tipe data untuk fishData
interface FishData {
  name: string;
  habitat: string;
  description: string;
  other_name: string;
  latin_name: string;
  image: string;
}

const DetectionResult = () => {
  const searchParams = useSearchParams();
  const className = searchParams.get('class_name');
  const [fishData, setFishData] = useState<FishData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchFishData = useCallback(async (className: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fish/search?name=${encodeURIComponent(className)}`);
      const data = await response.json();
      if (response.ok) {
        setFishData(data);
        setErrorMessage(null); // Reset error message
      } else {
        setErrorMessage('Gagal mendeteksi ikan. Silakan coba lagi.');
        console.error('Failed to fetch fish data:', data.message);
      }
    } catch (error) {
      setErrorMessage('Gagal mendeteksi ikan. Silakan coba lagi.');
      console.error('Error fetching fish data:', error);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    if (className) {
      // Fetch fish data based on class_name
      fetchFishData(className);
    }
  }, [className, fetchFishData]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white text-gray-800">
      <Navbar />

      {/* Hasil Deteksi */}
      <main className="max-w-4xl mx-auto mt-10 p-4 sm:p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-center text-base sm:text-xl font-extrabold text-blue-700 mb-4">Hasil Deteksi Penyakit Ikan dengan AI</h2>
        <p className="text-center text-sm sm:text-base text-gray-500 mb-8">Hasil deteksi spesies dan penyakit ikan menggunakan kecerdasan buatan</p>

        {errorMessage ? (
          <p className="text-center text-red-500">{errorMessage}</p>
        ) : fishData ? (
          <div className="flex flex-col items-center bg-gradient-to-r from-blue-50 to-white p-4 sm:p-6 rounded-xl shadow-md">
            <Image
              src={fishData.image} // Ganti dengan URL gambar ikan yang sesuai
              alt={fishData.name}
              width={250}
              height={180}
              className="rounded-full border-4 border-blue-300 shadow-lg object-cover"
              unoptimized={true} // Menghindari optimasi Next.js sehingga bisa pakai gambar dari domain eksternal tanpa konfigurasi tambahan
            />
            <h3 className="text-base sm:text-xl font-semibold mt-4 text-gray-700">{fishData.name} <span className="text-gray-500 italic">({fishData.latin_name})</span></h3>
            <p className="italic text-gray-500 mt-2 text-sm sm:text-base text-center">{fishData.other_name}</p>
          </div>
        ) : (
          <p className="text-center text-gray-500">Memuat data ikan...</p>
        )}

        {fishData && (
          <p className="mt-6 text-gray-700 leading-relaxed text-justify">
            {fishData.description}
          </p>
        )}

        {/* Tombol Navigasi */}
        <div className="mt-8 flex justify-center">
          <Link href="/" className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300">
            Kembali ke Beranda
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const DetectionResultPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <DetectionResult />
  </Suspense>
);

export default DetectionResultPage;