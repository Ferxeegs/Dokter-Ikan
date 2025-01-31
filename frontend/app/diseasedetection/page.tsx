'use client'

import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function DiseaseDetection() {
  const [showSpecies, setShowSpecies] = useState(false);  // State to toggle species list visibility
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);  // State to store the selected species

  const [selectedPhysicalSymptoms, setSelectedPhysicalSymptoms] = useState<Set<string>>(new Set());
  const [selectedBehavioralSymptoms, setSelectedBehavioralSymptoms] = useState<Set<string>>(new Set());

  const species = [
    'Ikan Koi',
    'Ikan Lele',
    'Ikan Nila',
    'Ikan Mas',
    'Ikan Gurame',
    'Ikan Bawal',
    'Ikan Patin',
    'Ikan Betutu',
  ];

  const physicalSymptoms = [
    'Tubuh membengkak',
    'Sirip koyak atau hilang',
    'Kulit tampak pucat',
    'Ada bercak-bercak pada tubuh',
    'Terdapat lapisan lendir pada tubuh',
    'Bintik-bintik putih di tubuh',
    'Perubahan warna tubuh (menjadi kemerahan atau kehitaman)',
    'Insang tampak berwarna merah atau bengkak',
    'Kehilangan keseimbangan tubuh',
    'Tanda-tanda luka atau borok pada tubuh',
  ];

  const behavioralSymptoms = [
    'Tenggelam atau berenang di permukaan terus-menerus',
    'Kurang nafsu makan',
    'Perubahan pola renang (bergerak secara tidak teratur)',
    'Sering menggosokkan tubuh ke objek keras',
    'Berenang dalam lingkaran atau melompat',
    'Menjadi lebih agresif terhadap ikan lain',
    'Perubahan pola pernapasan (lebih cepat atau lambat)',
    'Berenang dengan posisi tubuh miring atau terbalik',
    'Menghindari makanan atau penampakan manusia',
    'Cenderung bersembunyi di sudut akuarium atau keramba',
  ];

  const handleSelectSpecies = (speciesName: string) => {
    setSelectedSpecies(speciesName);
    setShowSpecies(false);
  };

  const toggleSymptom = (symptom: string, type: 'physical' | 'behavioral') => {
    if (type === 'physical') {
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

  const getButtonClass = (symptom: string, type: 'physical' | 'behavioral') => {
    const isSelected =
      type === 'physical'
        ? selectedPhysicalSymptoms.has(symptom)
        : selectedBehavioralSymptoms.has(symptom);

    return `px-4 py-2 rounded-xl w-full sm:w-auto ${
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
      <div className="flex-grow items-center justify-center px-8 py-12 text-center">
        {/* Title and Subtitle */}
        <div className="ml-6 mt-28">
          <h1 className="text-3xl font-bold mb-2 text-[#1A83FB] font-lato">
            Deteksi Penyakit Ikan dengan Expert System
          </h1>
          <h2 className="text-lg mb-6 text-[#2C2C2C]">
            Masukan gejala - gejala yang diderita oleh ikan seperti perubahan fisik dan perilaku ikan
          </h2>
        </div>

        {/* Fish Species Selection Box */}
        <div
          className="bg-white shadow-lg rounded-lg p-4 mb-8 w-full sm:max-w-md mx-auto border-2 border-blue-500 cursor-pointer"
          onClick={() => setShowSpecies(!showSpecies)}  // Toggle species list visibility
        >
          <h2 className="text-lg font-semibold text-center text-gray-700">Pilih Spesies Ikan</h2>
          <p className="mt-2 text-center text-gray-600">
            {selectedSpecies ? selectedSpecies : 'Klik untuk memilih spesies ikan'}
          </p>

          {/* Display species list if showSpecies is true */}
          {showSpecies && (
            <div className="mt-4">
              <ul className="pl-1">
                {species.map((speciesName, index) => (
                  <li
                    key={index}
                    className="py-1 cursor-pointer text-gray-600 hover:text-blue-600"
                    onClick={() => handleSelectSpecies(speciesName)}  // Set selected species
                  >
                    {speciesName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Single Box for Symptoms (Resize with Screen Width) */}
        <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-auto border-2 border-blue-500">
          <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
            Pilih Gejala pada Ikan
          </h2>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Gejala Fisik</h3>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {physicalSymptoms.map((symptom, idx) => (
                <button
                  key={idx}
                  className={getButtonClass(symptom, 'physical')}
                  onClick={() => toggleSymptom(symptom, 'physical')}
                >
                  {symptom}
                </button>
              ))}
            </div>
            {/* Border below Gejala Fisik */}
            <div className="border-b-2 border-gray-300 mt-4"></div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700">Gejala Perilaku</h3>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {behavioralSymptoms.map((symptom, idx) => (
                <button
                  key={idx}
                  className={getButtonClass(symptom, 'behavioral')}
                  onClick={() => toggleSymptom(symptom, 'behavioral')}
                >
                  {symptom}
                </button>
              ))}
            </div>
            {/* Border below Gejala Perilaku */}
            <div className="border-b-2 border-gray-300 mt-4"></div>
          </div>
        </div>

        {/* Button with Icon */}
        <div className="mt-12 flex justify-center">
          <button
            className="flex items-center gap-2 px-6 py-3 bg-[#1A83FB] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
          >
            {/* Icon (example: SVG or Font Awesome icon) */}
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
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
