'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import React, { useEffect, useState, useCallback } from 'react';
import { getDiseasesFromIndexedDB } from '../components/utils/indexedDB';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw, Home, MessageCircle } from 'lucide-react';
// Import Swiper dan modulnya
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCards } from 'swiper/modules';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

interface DiseaseData {
  name: string;
  description: string;
  image: string | null;
}

interface DiagnosisResult {
  disease: string;
  match_percentage: number;
}

interface ParsedData {
  success?: boolean;
  data?: {
    diagnoses: DiagnosisResult[] | string;
  };
  diagnoses?: DiagnosisResult[] | string; // For offline diagnosis
  offline?: boolean;
}

const DetectionResultContent = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');
  const [diseaseData, setDiseaseData] = useState<DiseaseData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, setActiveIndex] = useState(0);
  const [noDiagnosisMessage, setNoDiagnosisMessage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const fetchDiseases = useCallback(async (diseases: string[], offline: boolean = false) => {
    setIsLoading(true);
    console.log('Fetching diseases:', diseases, 'offline:', offline);

    try {
      if (offline || isOffline) {
        console.log('Fetching diseases from IndexedDB:', diseases);
        const offlineDiseases = await getDiseasesFromIndexedDB(diseases);
        console.log('Diseases from IndexedDB:', offlineDiseases);

        if (offlineDiseases && offlineDiseases.length > 0) {
          // Transform data sesuai dengan interface DiseaseData
          const formattedDiseases = offlineDiseases.map(disease => ({
            name: disease.name,
            description: disease.description,
            image: disease.image
          }));
          console.log('Formatted diseases:', formattedDiseases);
          setDiseaseData(formattedDiseases);
          setNoDiagnosisMessage(null); // Clear any previous error message
        } else {
          console.error('No diseases found in IndexedDB');
          setNoDiagnosisMessage('Data penyakit tidak tersedia dalam mode offline');
        }
      } else {
        // Online fetch from API
        const response = await fetch(`${API_BASE_URL}/fishdiseases`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ diseases }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        if (result.success) {
          setDiseaseData(result.data);
          setNoDiagnosisMessage(null); // Clear any previous error message
        } else {
          console.error('Failed to fetch diseases:', result.message);
          setNoDiagnosisMessage('Gagal mengambil data penyakit');
        }
      }
    } catch (error) {
      console.error('Error fetching diseases:', error);
      
      // If online request fails, try offline as fallback
      if (!offline && !isOffline) {
        console.log('Online request failed, trying offline fallback...');
        try {
          const offlineDiseases = await getDiseasesFromIndexedDB(diseases);
          if (offlineDiseases && offlineDiseases.length > 0) {
            const formattedDiseases = offlineDiseases.map(disease => ({
              name: disease.name,
              description: disease.description,
              image: disease.image
            }));
            setDiseaseData(formattedDiseases);
            setNoDiagnosisMessage(null);
          } else {
            setNoDiagnosisMessage('Terjadi kesalahan saat mengambil data penyakit');
          }
        } catch (offlineError) {
          console.error('Offline fallback also failed:', offlineError);
          setNoDiagnosisMessage('Terjadi kesalahan saat mengambil data penyakit');
        }
      } else {
        setNoDiagnosisMessage('Terjadi kesalahan saat mengambil data penyakit');
      }
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE_URL, isOffline]);

  useEffect(() => {
    if (data) {
      try {
        const parsedData = JSON.parse(data) as ParsedData;
        console.log('Parsed data:', parsedData);

        // Handle different data structures
        let diagnoses: DiagnosisResult[] | string;
        let isOfflineResult = false;

        // Check if it's a standard API response with success property
        if ('success' in parsedData && parsedData.success && parsedData.data) {
          diagnoses = parsedData.data.diagnoses;
          isOfflineResult = parsedData.offline === true;
        } 
        // Check if it's a direct offline diagnosis result
        else if ('diagnoses' in parsedData && parsedData.diagnoses) {
          diagnoses = parsedData.diagnoses;
          isOfflineResult = true; // Assume offline if no success property
        }
        // Handle case where the entire parsed data is the diagnosis result
        else if (Array.isArray(parsedData)) {
          diagnoses = parsedData;
          isOfflineResult = true;
        }
        else {
          console.error('Unexpected data format:', parsedData);
          setNoDiagnosisMessage('Format data tidak valid');
          setIsLoading(false);
          return;
        }

        // Handle case where diagnoses is a string (no match found)
        if (typeof diagnoses === "string") {
          if (diagnoses === "Tidak ada penyakit dengan kecocokan di atas 50%." || 
              diagnoses === "Tidak ada penyakit dengan kecocokan di atas 40%.") {
            setNoDiagnosisMessage("Tidak ada penyakit yang cocok dengan gejala");
          } else {
            setNoDiagnosisMessage(diagnoses);
          }
          setIsLoading(false);
        } 
        // Handle case where diagnoses is an array
        else if (Array.isArray(diagnoses)) {
          const diseases = diagnoses.map(
            (diagnosis: DiagnosisResult) => diagnosis.disease
          );
          console.log('Diseases to fetch:', diseases);
          console.log('Is offline result:', isOfflineResult);
          
          fetchDiseases(diseases, isOfflineResult);
        }
        // Handle unexpected data format
        else {
          console.error('Unexpected diagnoses format:', diagnoses);
          setNoDiagnosisMessage('Format data tidak valid');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to parse data:', error);
        setNoDiagnosisMessage('Gagal memproses hasil diagnosis');
        setIsLoading(false);
      }
    } else {
      setNoDiagnosisMessage('Tidak ada data diagnosis');
      setIsLoading(false);
    }
  }, [data, fetchDiseases]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 }, 
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-200 to-white text-gray-800">
      <Navbar />
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
          Mode Offline
        </div>
      )}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-center mb-4 sm:mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white drop-shadow-md">
              Hasil Deteksi Penyakit Ikan
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/80 mt-1">
              Diagnosa sistem pakar berdasarkan gejala yang dimasukkan
            </p>
          </motion.div>

          <motion.div
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border-t border-blue-100 p-3 sm:p-4 md:p-6 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-48 sm:h-64">
                <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 animate-spin mb-3 sm:mb-4" />
                <p className="text-gray-600 text-base sm:text-lg">Memuat hasil diagnosa...</p>
              </div>
            ) : noDiagnosisMessage ? (
              <motion.div
                className="flex flex-col items-center justify-center h-48 sm:h-64 bg-blue-50 rounded-xl p-4 sm:p-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500 mb-3 sm:mb-4" />
                </motion.div>
                <motion.p
                  variants={itemVariants}
                  className="text-gray-800 text-lg sm:text-xl font-medium text-center"
                >
                  {noDiagnosisMessage}
                </motion.p>
                <motion.p
                  variants={itemVariants}
                  className="text-gray-600 text-center mt-2 text-sm sm:text-base max-w-md"
                >
                  Silakan coba lagi dengan menyesuaikan gejalanya atau konsultasikan dengan tenaga ahli ikan
                </motion.p>
              </motion.div>
            ) : diseaseData.length === 0 ? (
              <motion.div
                className="flex flex-col items-center justify-center h-48 sm:h-64 bg-blue-50 rounded-xl p-4 sm:p-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={itemVariants}>
                  <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-blue-500 mb-3 sm:mb-4" />
                </motion.div>
                <motion.p
                  variants={itemVariants}
                  className="text-gray-800 text-lg sm:text-xl font-medium text-center"
                >
                  Tidak ada penyakit yang terdeteksi
                </motion.p>
                <motion.p
                  variants={itemVariants}
                  className="text-gray-600 text-center mt-2 text-sm sm:text-base max-w-md"
                >
                  Silakan coba lagi dengan gejala yang berbeda atau periksa kembali
                  input yang dimasukkan
                </motion.p>
              </motion.div>
            ) : (
              <div className="mb-4 max-h-[60vh] sm:max-h-[70vh] overflow-hidden">
                <Swiper
                  modules={[Navigation, Pagination, EffectCards]}
                  effect="cards"
                  grabCursor={true}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                  }}
                  navigation={true}
                  onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                  className="disease-swiper h-full"
                  cardsEffect={{
                    slideShadows: false,
                    perSlideRotate: 2,
                    perSlideOffset: 8,
                  }}
                >
                  {diseaseData.map((disease, index) => (
                    <SwiperSlide key={index}>
                      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3 sm:p-4 md:p-5 rounded-xl shadow-lg h-full">
                        <div className="flex flex-col h-full">
                          <div className="w-full mb-3 sm:mb-4">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white drop-shadow-sm">
                              {disease.name}
                            </h3>
                            <div className="mt-2">
                              <span className="inline-block bg-white/20 backdrop-blur-sm text-white px-3 py-1 text-xs sm:text-sm rounded-full font-medium">
                                Penyakit {index + 1} dari {diseaseData.length}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-grow">
                            <div className="sm:w-2/5 flex justify-center">
                              {disease.image ? (
                                <div className="w-full max-w-[150px] sm:max-w-xs md:max-w-sm aspect-square relative rounded-lg overflow-hidden">
                                  <Image
                                    src={disease.image}
                                    alt={disease.name}
                                    fill
                                    className="object-cover border-2 border-blue-300 shadow-md rounded-lg"
                                    unoptimized={true}
                                  />
                                </div>
                              ) : (
                                <div className="w-full max-w-[150px] sm:max-w-xs md:max-w-sm aspect-square bg-blue-100 border-2 border-blue-300 shadow-md rounded-lg flex items-center justify-center">
                                  <span className="text-blue-500 font-medium text-sm sm:text-base">
                                    Tidak ada gambar
                                  </span>
                                </div>
                              )}
                            </div>

                            <div className="sm:w-3/5 mt-3 sm:mt-0">
                              <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-lg flex-grow overflow-y-auto max-h-32 sm:max-h-64">
                                <p className="text-white text-sm sm:text-base leading-relaxed">
                                  {disease.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}

            <motion.div
              className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link
                href="/diseasedetection"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-blue-100 text-blue-700 font-semibold rounded-lg shadow-md hover:bg-blue-200 transition-all duration-300 text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Deteksi Ulang</span>
              </Link>
              <Link
                href="/"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-blue-100 text-blue-700 font-semibold rounded-lg shadow-md hover:bg-blue-200 transition-all duration-300 text-sm sm:text-base"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Kembali ke Beranda</span>
              </Link>
              <Link
                href="/userpost"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 text-sm sm:text-base"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Konsultasi dengan Ahli </span>
              </Link>
            </motion.div>
          </motion.div>

          {diseaseData.length > 0 && (
            <motion.div
              className="mt-3 sm:mt-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <p className="text-white text-xs sm:text-sm">
                Geser kartu untuk melihat penyakit lainnya
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Footer />

      {/* Custom CSS for better Swiper styling */}
      <style jsx global>{`
        .disease-swiper {
          padding: 15px 5px 30px;
        }
        .disease-swiper .swiper-pagination-bullet {
          background: #fff;
          opacity: 0.6;
        }
        .disease-swiper .swiper-pagination-bullet-active {
          background: #fff;
          opacity: 1;
        }
        .disease-swiper .swiper-button-next,
        .disease-swiper .swiper-button-prev {
          color: white;
          background: rgba(37, 99, 235, 0.5);
          width: 30px;
          height: 30px;
          border-radius: 50%;
          transform: translateY(-50%);
          backdrop-filter: blur(4px);
        }
        .disease-swiper .swiper-button-next:after,
        .disease-swiper .swiper-button-prev:after {
          font-size: 14px;
          font-weight: bold;
        }
        .disease-swiper .swiper-button-next:hover,
        .disease-swiper .swiper-button-prev:hover {
          background: rgba(37, 99, 235, 0.8);
        }
        @media (min-width: 640px) {
          .disease-swiper {
            padding: 20px 10px 40px;
          }
          .disease-swiper .swiper-button-next,
          .disease-swiper .swiper-button-prev {
            width: 40px;
            height: 40px;
          }
          .disease-swiper .swiper-button-next:after,
          .disease-swiper .swiper-button-prev:after {
            font-size: 18px;
          }
        }

        /* Custom Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #1a83fb, #69cbf4);
          border-radius: 10px;
          border: 2px solid #f0f0f0;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #1a83fb, #1a6fbf);
        }
      `}</style>
    </div>
  );
};

const DetectionResult = () => (
  <React.Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-400 to-white">
      <div className="flex flex-col items-center p-6 sm:p-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg">
        <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 animate-spin mb-3 sm:mb-4" />
        <p className="text-base sm:text-xl font-medium text-gray-700">Memuat hasil diagnosa...</p>
      </div>
    </div>
  }>
    <DetectionResultContent />
  </React.Suspense>
);

export default DetectionResult;