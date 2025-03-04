'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import React, { useEffect, useState, useCallback } from 'react';
import Slider, { Settings } from 'react-slick';
import { useSearchParams } from 'next/navigation';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface DiseaseData {
  name: string;
  description: string;
  image: string | null;
}

const DetectionResultContent = () => {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');
  const [diseaseData, setDiseaseData] = useState<DiseaseData[]>([]);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const fetchDiseases = useCallback(async (diseases: string[]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/fishdiseases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ diseases }),
      });
      const result = await response.json();
      if (result.success) {
        setDiseaseData(result.data);
      } else {
        console.error('Failed to fetch diseases:', result.message);
      }
    } catch (error) {
      console.error('Error fetching diseases:', error);
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.success && parsedData.data && Array.isArray(parsedData.data.diagnoses)) {
          const diseases = parsedData.data.diagnoses.map((diagnosis: { disease: string }) => diagnosis.disease);
          fetchDiseases(diseases);
        }
      } catch (error) {
        console.error('Failed to parse data:', error);
      }
    }
  }, [data, fetchDiseases]);

  const settings: Settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  function NextArrow(props: { className?: string; style?: React.CSSProperties; onClick?: () => void }) {
    const { className, style, onClick } = props;
    return (
      <button
        className={`${className} bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-all duration-300`}
        style={{ ...style, display: "block", right: "10px" }}
        onClick={onClick}
      >
        Next
      </button>
    );
  }

  function PrevArrow(props: { className?: string; style?: React.CSSProperties; onClick?: () => void }) {
    const { className, style, onClick } = props;
    return (
      <button
        className={`${className} bg-black text-white rounded-full p-3 shadow-lg hover:bg-gray-800 transition-all duration-300`}
        style={{ ...style, display: "block", left: "10px", zIndex: 1 }}
        onClick={onClick}
      >
        Prev
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 to-white text-gray-800">
      <Navbar />

      <main className="max-w-4xl mx-auto mt-10 p-4 sm:p-8 bg-white rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-center text-base sm:text-xl font-extrabold text-blue-700 mb-4">
          Hasil Deteksi Penyakit Ikan dengan Expert System
        </h2>
        <p className="text-center text-sm sm:text-base text-gray-500 mb-8">
          Hasil deteksi penyakit ikan menggunakan sistem pakar
        </p>

        <Slider {...settings}>
          {diseaseData.map((disease, index) => (
            <div key={index} className="flex flex-col items-center bg-gradient-to-r from-cyan-400 to-blue-600 p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
              <div className="flex justify-center items-center w-full">
                {disease.image ? (
                  <div className="w-48 h-48 relative">
                    <Image
                      src={disease.image}
                      alt={disease.name}
                      width={192}
                      height={192}
                      className="border-4 border-blue-300 shadow-lg object-cover rounded-lg mx-auto"
                      unoptimized={true}
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 relative bg-gray-200 border-4 border-blue-300 shadow-lg rounded-lg mx-auto flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <h3 className="text-lg sm:text-2xl font-semibold mt-4 text-white text-center">
                {disease.name}
              </h3>
              <p className="mt-4 text-gray-300 leading-relaxed text-center">
                {disease.description}
              </p>
            </div>
          ))}
        </Slider>

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

const DetectionResult = () => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <DetectionResultContent />
  </React.Suspense>
);

export default DetectionResult;