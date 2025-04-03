'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useCallback, Suspense } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

import { FiInfo, FiHome, FiLoader } from 'react-icons/fi';
import { GiSeahorse, GiWaterDrop } from 'react-icons/gi';

// Definisikan tipe data untuk fishData
interface FishData {
  name: string;
  habitat: string;
  description: string;
  other_name: string;
  latin_name: string;
  image: string;
}

// Komponen Skeleton untuk loading state
const SkeletonLoader = () => (
  <div className="w-full animate-pulse">
    <div className="flex flex-col items-center">
      <div className="w-48 h-48 bg-gray-200 rounded-full mb-4"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-6 bg-red-50 border border-red-200 rounded-xl shadow-sm"
  >
    <div className="flex flex-col items-center text-center">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <FiInfo className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-red-700 font-medium text-lg">Deteksi Gagal</h3>
      <p className="mt-2 text-red-600">{message}</p>
      <Link href="/" className="mt-6 px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg shadow-sm hover:bg-red-700 transition-all duration-300 flex items-center">
        <FiHome className="mr-2" /> Kembali ke Beranda
      </Link>
    </div>
  </motion.div>
);

const DetectionResult = () => {
  const searchParams = useSearchParams();
  const className = searchParams.get('class_name');
  const [fishData, setFishData] = useState<FishData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchFishData = useCallback(async (className: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/fish/search?name=${encodeURIComponent(className)}`);
      const data = await response.json();
      if (response.ok) {
        setFishData(data);
        setErrorMessage(null);
      } else {
        setErrorMessage('Gagal mendeteksi ikan. Silakan coba lagi.');
        console.error('Failed to fetch fish data:', data.message);
      }
    } catch (error) {
      setErrorMessage('Gagal mendeteksi ikan. Silakan coba lagi.');
      console.error('Error fetching fish data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    if (className) {
      // Fetch fish data based on class_name
      fetchFishData(className);
    }
  }, [className, fetchFishData]);

  // Animasi untuk fade-in content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-300 to-blue-50 text-gray-800">
      <Navbar />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden z-0 opacity-20 pointer-events-none">
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-10 w-48 h-48 bg-teal-400 rounded-full blur-3xl"></div>
      </div>

      {/* Hasil Deteksi */}
      <main className="relative z-10 max-w-4xl mx-auto pt-8 pb-12 px-4 sm:px-0">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-6 sm:p-8 bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-xl border border-blue-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-500 inline-block text-transparent bg-clip-text">
              Hasil Deteksi Penyakit Ikan dengan AI
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              Hasil deteksi spesies dan penyakit ikan menggunakan kecerdasan buatan
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto mt-4 rounded-full"></div>
          </div>

          {errorMessage ? (
            <ErrorDisplay message={errorMessage} />
          ) : isLoading ? (
            <SkeletonLoader />
          ) : fishData ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full blur-md transform scale-105 animate-pulse"></div>
                  <div className="relative">
                    <Image
                      src={fishData.image}
                      alt={fishData.name}
                      width={150}
                      height={150}
                      className="rounded-2xl border-4 border-white shadow-lg object-contain h-64 w-96"
                      unoptimized={true}
                    />
                  </div>
                </div>

                <motion.h3
                  variants={itemVariants}
                  className="text-xl sm:text-2xl font-bold text-gray-800 text-center"
                >
                  {fishData.name}
                </motion.h3>

                <motion.p
                  variants={itemVariants}
                  className="italic text-gray-500 mt-1 text-sm sm:text-base text-center"
                >
                  <span className="font-medium block">{fishData.latin_name}</span>
                  <span className="block">{fishData.other_name}</span>
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center mt-4 mb-6 bg-blue-50 px-4 py-2 rounded-full"
                >
                  <GiWaterDrop className="text-blue-500 mr-2" />
                  <span className="text-sm text-blue-700 font-medium">Habitat: {fishData.habitat}</span>
                </motion.div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl shadow-sm border border-blue-100"
              >
                <div className="flex items-start mb-3">
                  <GiSeahorse className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                  <h4 className="text-lg font-semibold text-blue-800">Informasi Spesies</h4>
                </div>
                <p className="text-gray-700 leading-relaxed text-justify">
                  {fishData.description}
                </p>
              </motion.div>

              {/* Tombol Navigasi */}
              <motion.div
                variants={itemVariants}
                className="mt-8 flex justify-center gap-3"
              >
                <Link
                  href="/fishdetection"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-blue-100 text-blue-700 font-semibold rounded-lg shadow-md hover:bg-blue-200 transition-all duration-300 text-sm sm:text-base"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Deteksi Ulang</span>
                </Link>
                <Link
                  href="/"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all duration-300 flex items-center"
                >
                  <FiHome className="mr-2" /> Kembali ke Beranda
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center py-12">
              <FiLoader className="animate-spin text-blue-500 w-12 h-12 mb-4" />
              <p className="text-center text-gray-500">Memuat data ikan...</p>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

const DetectionResultPage = () => (
  <Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-50">
      <div className="text-center">
        <FiLoader className="animate-spin text-blue-500 w-16 h-16 mb-4 mx-auto" />
        <p className="text-blue-600 font-medium">Memuat hasil deteksi...</p>
      </div>
    </div>
  }>
    <DetectionResult />
  </Suspense>
);

export default DetectionResultPage;