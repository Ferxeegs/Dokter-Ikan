'use client'

import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

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
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/symptoms`);
        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const physical = result.data.filter((symptom: Symptom) => symptom.type === 'fisik');
          const behavioral = result.data.filter((symptom: Symptom) => symptom.type === 'perilaku');

          setPhysicalSymptoms(physical);
          setBehavioralSymptoms(behavioral);
        } else {
          console.error('Data fetched is not an array:', result);
        }
      } catch (error) {
        console.error('Error fetching symptoms:', error);
      }
    };

    fetchSymptoms();
  }, [API_BASE_URL]);

  const toggleSymptom = (symptom: string, type: 'fisik' | 'perilaku') => {
    if (type === 'fisik') {
      setSelectedPhysicalSymptoms(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(symptom)) {
          newSelected.delete(symptom);
        } else {
          newSelected.add(symptom);
        }
        return newSelected;
      });
    } else {
      setSelectedBehavioralSymptoms(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(symptom)) {
          newSelected.delete(symptom);
        } else {
          newSelected.add(symptom);
        }
        return newSelected;
      });
    }
  };

  const getButtonClass = (symptom: string, type: 'fisik' | 'perilaku') => {
    const isSelected =
      type === 'fisik'
        ? selectedPhysicalSymptoms.has(symptom)
        : selectedBehavioralSymptoms.has(symptom);

    return `px-2 py-1 rounded-lg text-xs ${
      isSelected ? 'bg-blue-300' : 'bg-[#D2EFFC]'
    } text-gray-700 hover:bg-blue-300`;
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundColor: 'white',
        backgroundImage:
          'linear-gradient(to top, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 1) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0) 10%, rgba(255, 255, 255, 1) 80%), url("/bgpost.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center px-4 py-8 text-center">
        {/* Title and Subtitle */}
        <div className="w-full max-w-2xl mx-auto mt-12">
          <h1 className="text-lg sm:text-2xl font-bold mb-2 text-[#1A83FB] font-lato">
            Deteksi Penyakit Ikan dengan Expert System
          </h1>
          <h2 className="text-sm sm:text-lg mb-6 text-[#2C2C2C]">
            Masukan gejala - gejala yang diderita oleh ikan seperti perubahan fisik dan perilaku ikan
          </h2>
        </div>

        {/* Single Box for Symptoms (Resize with Screen Width) */}
        <div className="bg-white shadow-lg rounded-lg p-4 sm:p-6 w-full max-w-4xl mx-auto border-2 border-blue-500">
          <h2 className="text-sm sm:text-xl font-semibold text-center text-gray-700 mb-4 sm:mb-6">
            Pilih Gejala pada Ikan
          </h2>
          <div className="mb-4 sm:mb-6">
            <h3 className="text-sm sm:text-lg font-semibold text-gray-700">Gejala Fisik</h3>
            <div className="mt-2 sm:mt-4 flex flex-wrap justify-center gap-2">
              {physicalSymptoms.map((symptom) => (
                <button
                  key={symptom.symptoms_id}
                  className={getButtonClass(symptom.name, 'fisik')}
                  onClick={() => toggleSymptom(symptom.name, 'fisik')}
                >
                  {symptom.name}
                </button>
              ))}
            </div>
            {/* Border below Gejala Fisik */}
            <div className="border-b-2 border-gray-300 mt-4"></div>
          </div>

          <div>
            <h3 className="text-sm sm:text-lg font-semibold text-gray-700">Gejala Perilaku</h3>
            <div className="mt-2 sm:mt-4 flex flex-wrap justify-center gap-2">
              {behavioralSymptoms.map((symptom) => (
                <button
                  key={symptom.symptoms_id}
                  className={getButtonClass(symptom.name, 'perilaku')}
                  onClick={() => toggleSymptom(symptom.name, 'perilaku')}
                >
                  {symptom.name}
                </button>
              ))}
            </div>
            {/* Border below Gejala Perilaku */}
            <div className="border-b-2 border-gray-300 mt-4"></div>
          </div>
        </div>

        {/* Button with Icon */}
        <div className="mt-8 sm:mt-12 flex justify-center">
          <button
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-[#1A83FB] text-white text-base sm:text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            {/* Icon (example: SVG or Font Awesome icon) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-5 sm:w-6 h-5 sm:h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12h.01M12 15h.01M9 12h.01M12 9h.01M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
              />
            </svg>
            Periksa Penyakit
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}