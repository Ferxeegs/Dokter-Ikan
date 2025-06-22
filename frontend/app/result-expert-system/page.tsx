'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import React, { useEffect, useState, useCallback } from 'react';
import { getDiseasesFromIndexedDB } from '../components/utils/indexedDB';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Home, 
  MessageCircle, 
  TrendingUp, 
  CheckCircle,
  AlertTriangle,
  Info,
  Target,
  Activity,
  Microscope,
  Stethoscope
} from 'lucide-react';
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
  match_count: number;
  matched_symptoms: string[];
  percentage: number;
  required_symptoms: string[];
  total_symptoms: number;
  match_percentage?: number; // For backward compatibility
}

interface DiagnosisData {
  diagnoses: DiagnosisResult[] | string;
  input_symptoms?: string[];
  reasoning?: string[];
  status?: string;
  total_diagnoses?: number;
  total_facts?: number;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: DiagnosisData;
}

interface SelectedSymptoms {
  behavioral: string[];
  physical: string[];
}


interface ParsedData {
  success?: boolean;
  data?: DiagnosisData;
  diagnoses?: DiagnosisResult[] | string; // For offline diagnosis
  offline?: boolean;
  input_symptoms?: string[];
  reasoning?: string[];
  total_diagnoses?: number;
  total_facts?: number;
  // New properties for wrapped data
  result?: ApiResponse;
  timestamp?: string;
  selectedSymptoms?: SelectedSymptoms;
}

const DetectionResultContent = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');
  const [diseaseData, setDiseaseData] = useState<DiseaseData[]>([]);
  const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisResult[]>([]);
  const [inputSymptoms, setInputSymptoms] = useState<string[]>([]);
  const [reasoning, setReasoning] = useState<string[]>([]);
  const [, setTotalDiagnoses] = useState<number>(0);
  const [totalFacts, setTotalFacts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [, setActiveIndex] = useState(0);
  const [noDiagnosisMessage, setNoDiagnosisMessage] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [showReasoningDetails, setShowReasoningDetails] = useState(false);
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
    // Prioritas 1: Cek sessionStorage untuk data diagnosis terbaru
    const sessionDiagnosisData = typeof window !== 'undefined' ? sessionStorage.getItem('diagnosisResult') : null;
    
    if (sessionDiagnosisData) {
      console.log('Found diagnosis data in sessionStorage');
      try {
        const parsedSessionData = JSON.parse(sessionDiagnosisData) as ParsedData;
        console.log('Parsed session data:', parsedSessionData);
        
        // Clear sessionStorage setelah mengambil data untuk mencegah data lama
        sessionStorage.removeItem('diagnosisResult');
        
        processData(parsedSessionData);
        return;
      } catch (error) {
        console.error('Failed to parse session storage data:', error);
        sessionStorage.removeItem('diagnosisResult'); // Bersihkan data yang rusak
      }
    }

    // Prioritas 2: Fallback ke URL parameter jika sessionStorage kosong
    if (data) {
      console.log('Using URL parameter data as fallback');
      try {
        const parsedData = JSON.parse(data) as ParsedData;
        console.log('Parsed URL data:', parsedData);
        processData(parsedData);
        return;
      } catch (error) {
        console.error('Failed to parse URL data:', error);
        setNoDiagnosisMessage('Gagal memproses hasil diagnosis');
        setIsLoading(false);
        return;
      }
    }

    // Jika tidak ada data sama sekali
    console.log('No diagnosis data found');
    setNoDiagnosisMessage('Tidak ada data diagnosis');
    setIsLoading(false);
  }, [data, fetchDiseases]);

  const processData = (parsedData: ParsedData) => {
    console.log('Processing data:', parsedData);
    
    // Handle different data structures
    let diagnoses: DiagnosisResult[] | string;
    let isOfflineResult = false;
    let inputSymptoms: string[] = [];
    let reasoning: string[] = [];
    let totalDiagnoses = 0;
    let totalFacts = 0;

    try {
      // Case 1: Wrapped data with result property (new format)
      if ('result' in parsedData && parsedData.result) {
        console.log('Processing wrapped data format');
        const result = parsedData.result;
        
        if (result.success && result.data) {
          diagnoses = result.data.diagnoses;
          inputSymptoms = result.data.input_symptoms || [];
          reasoning = result.data.reasoning || [];
          totalDiagnoses = result.data.total_diagnoses || 0;
          totalFacts = result.data.total_facts || 0;
          isOfflineResult = false; // API response is online
        } else {
          console.error('API response indicates failure:', result.message);
          setNoDiagnosisMessage(result.message || 'Diagnosis gagal');
          setIsLoading(false);
          return;
        }
      }
      // Case 2: Standard API response with success property
      else if ('success' in parsedData && parsedData.success && parsedData.data) {
        console.log('Processing standard API response format');
        diagnoses = parsedData.data.diagnoses;
        isOfflineResult = parsedData.offline === true;
        inputSymptoms = parsedData.data.input_symptoms || [];
        reasoning = parsedData.data.reasoning || [];
        totalDiagnoses = parsedData.data.total_diagnoses || 0;
        totalFacts = parsedData.data.total_facts || 0;
      } 
      // Case 3: Direct offline diagnosis result
      else if ('diagnoses' in parsedData && parsedData.diagnoses) {
        console.log('Processing offline diagnosis format');
        diagnoses = parsedData.diagnoses;
        isOfflineResult = true; // Assume offline if no success property
        inputSymptoms = parsedData.input_symptoms || [];
        reasoning = parsedData.reasoning || [];
        totalDiagnoses = parsedData.total_diagnoses || 0;
        totalFacts = parsedData.total_facts || 0;
      }
      // Case 4: Array of diagnosis results
      else if (Array.isArray(parsedData)) {
        console.log('Processing array format');
        diagnoses = parsedData;
        isOfflineResult = true;
      }
      else {
        console.error('Unexpected data format:', parsedData);
        setNoDiagnosisMessage('Format data tidak valid');
        setIsLoading(false);
        return;
      }

      // Set additional data
      setInputSymptoms(inputSymptoms);
      setReasoning(reasoning);
      setTotalDiagnoses(totalDiagnoses);
      setTotalFacts(totalFacts);

      console.log('Processed diagnoses:', diagnoses);
      console.log('Input symptoms:', inputSymptoms);
      console.log('Reasoning:', reasoning);

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
        // Store diagnosis results for display
        setDiagnosisResults(diagnoses);
        
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
      console.error('Error processing data:', error);
      setNoDiagnosisMessage('Terjadi kesalahan saat memproses data');
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    if (percentage >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getConfidenceIcon = (percentage: number) => {
    if (percentage >= 80) return <CheckCircle className="w-4 h-4" />;
    if (percentage >= 60) return <TrendingUp className="w-4 h-4" />;
    if (percentage >= 40) return <AlertTriangle className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const formatSymptom = (symptom: string) => {
    return symptom.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

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

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-300 text-gray-800">
    <Navbar />
    {isOffline && (
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
        <div className="flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span className="font-medium text-sm">Mode Offline Aktif</span>
        </div>
      </div>
    )}
    
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-4 sm:mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Microscope className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-lg">
              Hasil Diagnosis Penyakit Ikan
            </h2>
          </div>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg text-white/90 font-medium px-2">
            Sistem Pakar Deteksi Penyakit Berbasis Aturan Forward Chaining
          </p>
        </motion.div>

        {/* Statistics Cards */}
        {diagnosisResults.length > 0 && (
          <motion.div
            className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center shadow-lg">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Target className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-800">{diagnosisResults.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Penyakit Terdeteksi</div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center shadow-lg">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Activity className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-800">{inputSymptoms.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Gejala Input</div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center shadow-lg">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <Stethoscope className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-800">{totalFacts}</div>
              <div className="text-xs sm:text-sm text-gray-600">Total Fakta</div>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 text-center shadow-lg">
              <div className="flex items-center justify-center mb-1 sm:mb-2">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div className="text-lg sm:text-2xl font-bold text-gray-800">
                {diagnosisResults.length > 0 ? Math.round(diagnosisResults[0].percentage) : 0}%
              </div>
              <div className="text-xs sm:text-sm text-gray-600">Tingkat Kepercayaan Tertinggi</div>
            </motion.div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 p-3 sm:p-4 md:p-6 lg:p-8 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 sm:h-64 md:h-80">
              <div className="relative">
                <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-blue-500 animate-spin" />
                <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
              </div>
              <p className="text-gray-700 text-base sm:text-lg md:text-xl font-medium mt-3 sm:mt-4">
                Menganalisis hasil diagnosis...
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">
                Harap tunggu sebentar
              </p>
            </div>
          ) : noDiagnosisMessage ? (
            <motion.div
              className="flex flex-col items-center justify-center h-48 sm:h-64 md:h-80 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <div className="p-3 sm:p-4 bg-blue-100 rounded-full mb-3 sm:mb-4">
                  <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-blue-600" />
                </div>
              </motion.div>
              <motion.p variants={itemVariants} className="text-gray-800 text-lg sm:text-xl md:text-2xl font-bold text-center mb-2">
                {noDiagnosisMessage}
              </motion.p>
              <motion.p variants={itemVariants} className="text-gray-600 text-center text-xs sm:text-sm md:text-base max-w-md px-2">
                Silakan coba lagi dengan menyesuaikan gejala atau konsultasikan dengan ahli ikan
              </motion.p>
            </motion.div>
          ) : diseaseData.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center h-48 sm:h-64 md:h-80 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <div className="p-3 sm:p-4 bg-blue-100 rounded-full mb-3 sm:mb-4">
                  <AlertCircle className="h-8 w-8 sm:h-12 sm:w-12 md:h-16 md:w-16 text-blue-600" />
                </div>
              </motion.div>
              <motion.p variants={itemVariants} className="text-gray-800 text-lg sm:text-xl md:text-2xl font-bold text-center mb-2">
                Tidak ada penyakit yang terdeteksi
              </motion.p>
              <motion.p variants={itemVariants} className="text-gray-600 text-center text-xs sm:text-sm md:text-base max-w-md px-2">
                Silakan coba lagi dengan gejala yang berbeda atau periksa kembali input yang dimasukkan
              </motion.p>
            </motion.div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Disease Cards Swiper */}
              <div className="mb-4 sm:mb-6 h-[75vh] sm:h-[80vh] overflow-hidden">
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
                  {diseaseData
                    .sort((a, b) => {
                      const diagnosisA = diagnosisResults.find(d => d.disease === a.name);
                      const diagnosisB = diagnosisResults.find(d => d.disease === b.name);
                      return (diagnosisB?.percentage || 0) - (diagnosisA?.percentage || 0);
                    })
                    .map((disease, index) => {
                      const diagnosisData = diagnosisResults.find(d => d.disease === disease.name);
                      return (
                        <SwiperSlide key={index}>
                          <motion.div
                            className="bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl shadow-2xl h-full border border-white/20 overflow-y-auto"
                            variants={cardVariants}
                            initial="hidden"
                            animate="visible"
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="flex flex-col min-h-full">
                              {/* Header - Fixed */}
                              <div className="mb-3 sm:mb-4 flex-shrink-0">
                                <div className="flex items-center justify-between mb-2 sm:mb-3">
                                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-sm">
                                    {disease.name}
                                  </h3>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-white/80">
                                      #{index + 1}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Confidence Level */}
                                {diagnosisData && (
                                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                    <div className={`flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full ${getConfidenceColor(diagnosisData.percentage)}`}>
                                      {getConfidenceIcon(diagnosisData.percentage)}
                                      <span className="font-semibold text-xs sm:text-sm">
                                        {diagnosisData.percentage.toFixed(1)}%
                                      </span>
                                    </div>
                                    <div className="bg-white/20 backdrop-blur-sm text-white px-2 sm:px-3 py-1 text-xs rounded-full font-medium">
                                      {diagnosisData.match_count}/{diagnosisData.total_symptoms} Gejala Cocok
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Scrollable Content */}
                              <div className="flex flex-col gap-3 sm:gap-4 flex-1 min-h-0">
                                {/* Image - Responsive size */}
                                <div className="flex justify-center flex-shrink-0">
                                  {disease.image ? (
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg">
                                      <Image
                                        src={disease.image}
                                        alt={disease.name}
                                        fill
                                        className="object-cover border-2 border-white/30 rounded-lg sm:rounded-xl"
                                        unoptimized={true}
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-white/20 border-2 border-white/30 shadow-lg rounded-lg sm:rounded-xl flex items-center justify-center backdrop-blur-sm">
                                      <span className="text-white/80 font-medium text-xs sm:text-sm text-center px-2">
                                        Tidak ada gambar
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Description and Symptoms - Scrollable */}
                                <div className="space-y-3 sm:space-y-4 flex-1 overflow-y-auto">
                                  {/* Description */}
                                  <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl">
                                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                      <Info className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                      <span className="text-sm sm:text-base">Deskripsi</span>
                                    </h4>
                                    <div className="max-h-32 sm:max-h-40 overflow-y-auto">
                                      <p className="text-white/90 text-xs sm:text-sm md:text-base leading-relaxed">
                                        {disease.description}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Matched Symptoms */}
                                  {diagnosisData && diagnosisData.matched_symptoms && diagnosisData.matched_symptoms.length > 0 && (
                                    <div className="bg-white/20 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl">
                                      <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                        <span className="text-sm sm:text-base">Gejala yang Cocok</span>
                                      </h4>
                                      <div className="max-h-32 sm:max-h-40 overflow-y-auto">
                                        <div className="flex flex-wrap gap-1 sm:gap-2">
                                          {diagnosisData.matched_symptoms.map((symptom, idx) => (
                                            <span
                                              key={idx}
                                              className="bg-green-500/20 text-green-100 px-2 py-1 rounded-md sm:rounded-lg text-xs font-medium border border-green-400/30 inline-block"
                                            >
                                              {formatSymptom(symptom)}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </SwiperSlide>
                      );
                    })}
                </Swiper>
              </div>

              {/* Input Symptoms */}
              {inputSymptoms.length > 0 && (
                <motion.div
                  className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-blue-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Gejala yang Diinput
                  </h3>
                  <div className="max-h-32 overflow-y-auto">
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {inputSymptoms.map((symptom, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border border-blue-300"
                        >
                          {formatSymptom(symptom)}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Reasoning Details */}
              {reasoning.length > 0 && (
                <motion.div
                  className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl border border-purple-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                      <Microscope className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                      Detail Proses Diagnosis
                    </h3>
                    <button
                      onClick={() => setShowReasoningDetails(!showReasoningDetails)}
                      className="text-purple-600 hover:text-purple-800 transition-colors text-xs sm:text-sm"
                    >
                      {showReasoningDetails ? 'Sembunyikan' : 'Tampilkan'}
                    </button>
                  </div>
                  
                  {showReasoningDetails && (
                    <motion.div
                      className="space-y-2 max-h-64 overflow-y-auto"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.3 }}
                    >
                      {reasoning.map((reason, index) => (
                        <div key={index} className="bg-white/60 p-3 rounded-lg text-xs sm:text-sm text-gray-700">
                          {reason}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="mt-4 sm:mt-6 md:mt-8 flex flex-col gap-2 sm:gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <Link
              href="/diseasedetection"
              className="w-full flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Deteksi Ulang</span>
            </Link>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-300"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Kembali ke Beranda</span>
              </Link>
              <Link
                href="/userpost"
                className="flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-lg sm:rounded-xl shadow-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-sm sm:text-base">Konsultasi dengan Ahli</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Helper Text */}
        {diseaseData.length > 0 && (
          <motion.div
            className="mt-3 sm:mt-4 md:mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3 inline-block">
              <p className="text-white text-xs sm:text-sm md:text-base font-medium flex items-center gap-2">
                <Info className="w-3 h-3 sm:w-4 sm:h-4" />
                Geser kartu untuk melihat detail penyakit lainnya
              </p>
            </div>
          </motion.div>
        )}

        {/* Diagnosis Summary */}
        {diagnosisResults.length > 0 && (
          <motion.div
            className="mt-4 sm:mt-6 bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-xl p-3 sm:p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              Ringkasan Diagnosis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {diagnosisResults
                .sort((a, b) => b.percentage - a.percentage)
                .map((diagnosis, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-blue-200"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: 1.1 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                        {diagnosis.disease}
                      </h4>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(diagnosis.percentage)}`}>
                        {getConfidenceIcon(diagnosis.percentage)}
                        <span>{diagnosis.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Gejala Cocok:</span>
                        <span className="font-medium">{diagnosis.match_count}/{diagnosis.total_symptoms}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${diagnosis.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>

    <Footer />

      {/* Enhanced Custom CSS */}
      <style jsx global>{`
        .disease-swiper {
          padding: 20px 10px 50px;
        }
        .disease-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.7);
          opacity: 0.6;
          width: 12px;
          height: 12px;
        }
        .disease-swiper .swiper-pagination-bullet-active {
          background: #fff;
          opacity: 1;
          transform: scale(1.2);
        }
        .disease-swiper .swiper-button-next,
        .disease-swiper .swiper-button-prev {
          color: white;
          background: rgba(37, 99, 235, 0.7);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        .disease-swiper .swiper-button-next:after,
        .disease-swiper .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
        }
        .disease-swiper .swiper-button-next:hover,
        .disease-swiper .swiper-button-prev:hover {
          background: rgba(37, 99, 235, 0.9);
          transform: scale(1.1);
          box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
        }
        
        @media (min-width: 640px) {
          .disease-swiper {
            padding: 25px 15px 60px;
          }
          .disease-swiper .swiper-button-next,
          .disease-swiper .swiper-button-prev {
            width: 50px;
            height: 50px;
          }
          .disease-swiper .swiper-button-next:after,
          .disease-swiper .swiper-button-prev:after {
            font-size: 20px;
          }
        }

        /* Enhanced Scrollbar Styling */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: linear-gradient(90deg, #f0f9ff, #e0f2fe);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #0ea5e9, #06b6d4);
          border-radius: 10px;
          border: 2px solid #f0f9ff;
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #0284c7, #0891b2);
          box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
        }

        /* Custom animation for confidence indicators */
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(37, 99, 235, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(37, 99, 235, 0.8);
          }
        }

        .confidence-high {
          animation: pulse-glow 2s infinite;
        }

        /* Enhanced card hover effects */
        .swiper-slide {
          transition: transform 0.3s ease;
        }
        
        .swiper-slide:hover {
          transform: translateY(-5px);
        }

        /* Gradient text effect */
        .gradient-text {
          background: linear-gradient(45deg, #3b82f6, #06b6d4);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Loading animation enhancement */
        @keyframes spin-glow {
          0% {
            transform: rotate(0deg);
            filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.8));
          }
          100% {
            transform: rotate(360deg);
            filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5));
          }
        }

        .enhanced-loading {
          animation: spin-glow 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

const DetectionResult = () => (
  <React.Suspense fallback={
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-300">
      <div className="flex flex-col items-center p-8 bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
        <div className="relative mb-4">
          <Loader2 className="w-16 h-16 sm:w-20 sm:h-20 text-blue-500 enhanced-loading" />
          <div className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Memuat Hasil Diagnosis</p>
        <p className="text-gray-600">Harap tunggu sebentar...</p>
      </div>
    </div>
  }>
    <DetectionResultContent />
  </React.Suspense>
);

export default DetectionResult;