'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { getSymptomsFromIndexedDB } from '../components/utils/indexedDB';
import { diagnoseDisease } from './logic';

interface Symptom {
  symptoms_id: number;
  name: string;
  code: string;
  type: 'fisik' | 'perilaku';
}

// Add proper type definition for diagnosis result
interface DiagnosisResult {
  success?: boolean;
  data?: {
    disease: string;
    confidence: number;
    symptoms: string[];
    recommendations?: string[];
  };
  message?: string;
  // Add other possible properties based on your API response
  [key: string]: unknown;
}

interface DiagnosisData {
  result: DiagnosisResult;
  timestamp: string;
  selectedSymptoms: {
    physical: string[];
    behavioral: string[];
  };
}

export default function DiseaseDetection() {
  const [selectedPhysicalSymptoms, setSelectedPhysicalSymptoms] = useState<Set<string>>(new Set());
  const [selectedBehavioralSymptoms, setSelectedBehavioralSymptoms] = useState<Set<string>>(new Set());
  const [physicalSymptoms, setPhysicalSymptoms] = useState<Symptom[]>([]);
  const [behavioralSymptoms, setBehavioralSymptoms] = useState<Symptom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();
  const [isOffline, setIsOffline] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'offline' | 'online'>('online');

  useEffect(() => {
    // Handler untuk status online/offline
    const handleOnline = () => {
      // Hanya tampilkan notifikasi online jika sebelumnya offline
      if (isOffline) {
        setNotificationType('online');
        setShowNotification(true);
        setIsOffline(false);
      }
    };

    const handleOffline = () => {
      setNotificationType('offline');
      setShowNotification(true);
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Deteksi status awal saat mount
    if (!navigator.onLine) {
      setNotificationType('offline');
      setShowNotification(true);
      setIsOffline(true);
    } else {
      // Tidak menampilkan notifikasi online saat pertama kali
      setIsOffline(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isOffline]);

  // Tambahkan useEffect untuk auto-hide notifikasi
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  useEffect(() => {
    const fetchData = async () => {
      setIsFetching(true);
      try {
        // Fetch symptoms
        const symptomsResponse = await fetch(`${API_BASE_URL}/symptoms`);
        const symptomsResult = await symptomsResponse.json();

        if (symptomsResult.success && Array.isArray(symptomsResult.data)) {
          // Save symptoms to IndexedDB
          // await saveSymptomsToIndexedDB(symptomsResult.data);
          const physical = symptomsResult.data.filter((s: Symptom) => s.type === 'fisik');
          const behavioral = symptomsResult.data.filter((s: Symptom) => s.type === 'perilaku');
          setPhysicalSymptoms(physical);
          setBehavioralSymptoms(behavioral);
        }

      } catch {
        console.error('Gagal fetch online, mencoba load dari IndexedDB...');
        try {
          const offlineData = await getSymptomsFromIndexedDB();
          const physical = offlineData.filter((s: Symptom) => s.type === 'fisik');
          const behavioral = offlineData.filter((s: Symptom) => s.type === 'perilaku');
          setPhysicalSymptoms(physical);
          setBehavioralSymptoms(behavioral);
        } catch (dbError) {
          console.error('Failed to load from IndexedDB:', dbError);
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

  // Menggunakan useCallback untuk memastikan fungsi ini tidak direkonstruksi pada setiap render
  const toggleSymptom = useCallback((symptomCode: string, type: 'fisik' | 'perilaku') => {
    if (type === 'fisik') {
      setSelectedPhysicalSymptoms(prevSelected => {
        const newSet = new Set(prevSelected);
        if (newSet.has(symptomCode)) {
          newSet.delete(symptomCode);
        } else {
          newSet.add(symptomCode);
        }
        return newSet;
      });
    } else {
      setSelectedBehavioralSymptoms(prevSelected => {
        const newSet = new Set(prevSelected);
        if (newSet.has(symptomCode)) {
          newSet.delete(symptomCode);
        } else {
          newSet.add(symptomCode);
        }
        return newSet;
      });
    }
  }, []);

  // Fungsi untuk menyimpan data ke sessionStorage
  const saveDiagnosisToSession = (result: DiagnosisResult): string | null => {
    try {
      const diagnosisData: DiagnosisData = {
        result: result,
        timestamp: new Date().toISOString(),
        selectedSymptoms: {
          physical: Array.from(selectedPhysicalSymptoms),
          behavioral: Array.from(selectedBehavioralSymptoms)
        }
      };
      
      // Simpan ke sessionStorage
      sessionStorage.setItem('diagnosisResult', JSON.stringify(diagnosisData));
      
      // Clear any previous diagnosis data to prevent accumulation
      const keys = Object.keys(sessionStorage);
      keys.forEach(key => {
        if (key.startsWith('diagnosisResult_') && key !== 'diagnosisResult') {
          sessionStorage.removeItem(key);
        }
      });
      
      console.log('Diagnosis data saved to sessionStorage:', diagnosisData);
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
      // Fallback to URL params if sessionStorage fails
      return JSON.stringify(result);
    }
    return null;
  };

  const handleSubmit = async () => {
    const selectedSymptoms = [
      ...Array.from(selectedPhysicalSymptoms),
      ...Array.from(selectedBehavioralSymptoms),
    ];

    if (selectedSymptoms.length === 0) {
      alert('Harap pilih minimal satu gejala');
      return;
    }

    console.log('Data yang dikirim:', { symptoms: selectedSymptoms });
    setIsLoading(true);

    try {
      let result: DiagnosisResult;
      
      if (isOffline) {
        // Diagnosa offline menggunakan logic.ts
        result = diagnoseDisease(selectedSymptoms);
        console.log('Offline diagnosis result:', result);
      } else {
        // Online diagnosis menggunakan API
        const response = await fetch(`${API_BASE_URL}/diagnose`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symptoms: selectedSymptoms }),
        });

        result = await response.json() as DiagnosisResult;
        if (!response.ok) {
          console.error('Failed to diagnose:', result.message);
          alert('Gagal mendiagnosa: ' + result.message);
          return;
        }
        console.log('Online diagnosis result:', result);
      }

      // Simpan hasil diagnosis ke sessionStorage
      const fallbackData = saveDiagnosisToSession(result);
      
      // Navigate ke halaman hasil
      if (fallbackData) {
        // Jika sessionStorage gagal, gunakan URL params sebagai fallback
        router.push(`/result-expert-system?data=${encodeURIComponent(fallbackData)}`);
      } else {
        // Jika berhasil disimpan ke sessionStorage, navigate tanpa params
        router.push('/result-expert-system');
      }
      
    } catch (error) {
      console.error('Error diagnosing:', error);
      
      // Jika online gagal, coba offline sebagai fallback
      if (!isOffline) {
        try {
          console.log('Mencoba diagnosa offline sebagai fallback...');
          const offlineResult = diagnoseDisease(selectedSymptoms);
          const fallbackData = saveDiagnosisToSession(offlineResult);
          
          if (fallbackData) {
            router.push(`/result-expert-system?data=${encodeURIComponent(fallbackData)}`);
          } else {
            router.push('/result-expert-system');
          }
        } catch (offlineError) {
          console.error('Offline fallback also failed:', offlineError);
          alert('Terjadi kesalahan saat mendiagnosa');
        }
      } else {
        alert('Terjadi kesalahan saat mendiagnosa');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Memindahkan logika tombol ke component terpisah untuk menghindari re-render yang tidak perlu
  const SymptomButton = ({ symptom, type }: { symptom: Symptom; type: 'fisik' | 'perilaku' }) => {
    const selected = type === 'fisik'
      ? selectedPhysicalSymptoms.has(symptom.code)
      : selectedBehavioralSymptoms.has(symptom.code);

    return (
      <button
        key={symptom.symptoms_id}
        className={`px-3 py-2 rounded-lg text-sm ${selected ? 'bg-blue-500 text-white font-medium shadow-md transform scale-105' : 'bg-[#D2EFFC]'
          } text-gray-700 hover:bg-blue-400 hover:text-white transition-all duration-200 mb-2`}
        onClick={() => toggleSymptom(symptom.code, type)}
      >
        {symptom.name}
      </button>
    );
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundColor: '#f0f9ff',
        backgroundImage:
          'linear-gradient(to top, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 1) 100%), linear-gradient(to bottom, rgba(240, 249, 255, 0) 10%, rgba(240, 249, 255, 1) 80%), url("/bgpost.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-8 text-center">
        {/* Title and Subtitle */}
        <motion.div
          className="w-full max-w-2xl mx-auto mt-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-3 text-[#1A83FB] font-lato">
            Deteksi Penyakit Ikan dengan Expert System
          </h1>
          <h2 className="text-sm sm:text-lg mb-8 text-[#2C2C2C]">
            Masukan gejala-gejala yang diderita oleh ikan seperti perubahan fisik dan perilaku ikan
          </h2>
        </motion.div>

        {/* Symptoms Box */}
        <motion.div
          className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-4xl mx-auto border-2 border-blue-500"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-base sm:text-2xl font-bold text-center text-blue-600 mb-6 sm:mb-8">
            Pilih Gejala pada Ikan
          </h2>

          {isFetching ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Memuat data gejala...</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                    1
                  </div>
                  <h3 className="text-base sm:text-xl font-semibold text-gray-800">Gejala Fisik</h3>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2 bg-blue-50 p-4 rounded-xl">
                  {physicalSymptoms.map((symptom) => (
                    <SymptomButton
                      key={symptom.symptoms_id}
                      symptom={symptom}
                      type="fisik"
                    />
                  ))}
                </div>
                {/* Border below Gejala Fisik */}
                <div className="border-b-2 border-gray-200 mt-6"></div>
              </div>

              <div className="mb-4">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-3">
                    2
                  </div>
                  <h3 className="text-base sm:text-xl font-semibold text-gray-800">Gejala Perilaku</h3>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2 bg-blue-50 p-4 rounded-xl">
                  {behavioralSymptoms.map((symptom) => (
                    <SymptomButton
                      key={symptom.symptoms_id}
                      symptom={symptom}
                      type="perilaku"
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Selected Symptoms Summary */}
          <div className="mt-8 p-4 bg-blue-100 rounded-lg">
            <p className="font-medium text-gray-700">
              Gejala terpilih: {selectedPhysicalSymptoms.size + selectedBehavioralSymptoms.size}
            </p>
          </div>
        </motion.div>

        {/* Button with Icon */}
        <motion.div
          className="mt-10 sm:mt-14 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={handleSubmit}
            disabled={isLoading || isFetching}
            className={`flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#1A83FB] text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 ${isLoading || isFetching ? 'opacity-70 cursor-not-allowed' : ''
              }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Mendiagnosa...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12h.01M12 15h.01M9 12h.01M12 9h.01M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                  />
                </svg>
                Periksa Penyakit
              </>
            )}
          </button>
        </motion.div>
      </div>

      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slideInRight">
          <div className={`
      ${notificationType === 'offline'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
              : 'bg-gradient-to-r from-green-500 to-emerald-500'
            }
      text-white px-4 sm:px-6 py-3 rounded-xl shadow-2xl backdrop-blur-sm border border-white/20
      transform transition-all duration-300 ease-out
      max-w-xs sm:max-w-sm w-full mx-4 sm:mx-0
      animate-fadeInScale
    `}>
            <div className="flex items-center space-x-3">
              {/* Icon */}
              <div className="flex-shrink-0">
                {notificationType === 'offline' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-white animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 5.636l-12.728 12.728m0 0L5.636 18.364m12.728-12.728L5.636 5.636m12.728 12.728L18.364 18.364"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 text-white animate-bounce"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                    />
                  </svg>
                )}
              </div>
              {/* Message */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {notificationType === 'offline' ? 'Mode Offline' : 'Terhubung Online'}
                </p>
                <p className="text-xs opacity-90 truncate">
                  {notificationType === 'offline'
                    ? 'Menggunakan deteksi lokal'
                    : 'Koneksi internet tersedia'
                  }
                </p>
              </div>
              {/* Status indicator */}
              <div className="flex-shrink-0">
                <div className={`
            w-2 h-2 rounded-full
            ${notificationType === 'offline'
                    ? 'bg-white animate-ping'
                    : 'bg-white animate-pulse'
                  }
          `}></div>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-2 w-full bg-white/20 rounded-full h-1 overflow-hidden">
              <div
                className="h-full bg-white rounded-full progress-bar-animation"
                style={{
                  animationDuration: '4s',
                  animationTimingFunction: 'linear',
                  animationFillMode: 'forwards'
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes progressBar {
          from { 
            width: 100%; 
          }
          to { 
            width: 0%; 
          }
        }

        .progress-bar-animation {
          width: 100%;
          animation: progressBar 4s linear forwards;
        }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95);}
          to { opacity: 1; transform: scale(1);}
        }

        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>

      {/* Footer */}
      <Footer />
    </div>
  );
}