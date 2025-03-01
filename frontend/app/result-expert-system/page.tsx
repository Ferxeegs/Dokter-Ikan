'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import React, { Suspense } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface DiseaseData {
  name: string;
  description: string;
  image: string;
}

const DetectionResult = () => {
  const diseaseData: DiseaseData[] = [
    {
      name: 'Penyakit Sirip Merah',
      description: 'Penyakit ini menyebabkan sirip ikan menjadi merah dan rusak. Penyebabnya adalah infeksi bakteri yang menyerang sirip ikan.',
      image: '/path/to/image1.jpg',
    },
    {
      name: 'Penyakit Kulit Putih',
      description: 'Penyakit ini menyebabkan kulit ikan menjadi putih dan bersisik. Penyebabnya adalah infeksi jamur yang menyerang kulit ikan.',
      image: '/path/to/image2.jpg',
    }
  ];

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  function NextArrow(props: any) {
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

  function PrevArrow(props: any) {
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
              {/* Bagian gambar agar benar-benar di tengah */}
              <div className="flex justify-center items-center w-full">
                <div className="w-48 h-48 relative">
                  <Image
                    src={disease.image}
                    alt={disease.name}
                    width={192} // Atur ukuran gambar agar tetap proporsional
                    height={192}
                    className="border-4 border-blue-300 shadow-lg object-cover rounded-lg mx-auto"
                    unoptimized={true}
                  />
                </div>
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

const DetectionResultPage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <DetectionResult />
  </Suspense>
);

export default DetectionResultPage;
