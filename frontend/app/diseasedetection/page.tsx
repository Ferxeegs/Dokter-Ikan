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
      if (isOffline) {
        // Diagnosa offline menggunakan logic.ts
        const result = diagnoseDisease(selectedSymptoms);
        console.log('Offline diagnosis result:', result);
        router.push(`/result-expert-system?data=${encodeURIComponent(JSON.stringify(result))}`);
      } else {
        // Online diagnosis menggunakan API
        const response = await fetch(`${API_BASE_URL}/diagnose`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ symptoms: selectedSymptoms }),
        });

        const result = await response.json();
        if (response.ok) {
          console.log('Online diagnosis result:', result);
          router.push(`/result-expert-system?data=${encodeURIComponent(JSON.stringify(result))}`);
        } else {
          console.error('Failed to diagnose:', result.message);
          alert('Gagal mendiagnosa: ' + result.message);
        }
      }
    } catch (error) {
      console.error('Error diagnosing:', error);
      alert('Terjadi kesalahan saat mendiagnosa');
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
        className={`px-3 py-2 rounded-lg text-sm ${
          selected ? 'bg-blue-500 text-white font-medium shadow-md transform scale-105' : 'bg-[#D2EFFC]'
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

      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50">
          Mode Offline
        </div>
      )}

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
            className={`flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#1A83FB] text-white text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-300 ${
              isLoading || isFetching ? 'opacity-70 cursor-not-allowed' : ''
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

      {/* Footer */}
      <Footer />
    </div>
  );
}