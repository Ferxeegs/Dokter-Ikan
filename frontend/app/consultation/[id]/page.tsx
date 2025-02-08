'use client';

import Navbar from '@/app/components/layout/Navbar';
import Footer from '@/app/components/layout/Footer';
import Complaint from '@/app/components/complaints/Complaint';
import Answer from '@/app/components/answers/Answer';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import DetailResep from '@/app/components/prescriptions/DetailResep';
import ChatConsultation from '@/app/components/chat/ChatConsultation';

export default function Consultation() {
  const { id } = useParams();
  
  const consultationId = Array.isArray(id) ? id[0] : id;

  if (!consultationId) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <p className="text-xl font-semibold text-red-600">Consultation ID tidak ditemukan.</p>
      </div>
    );
  }

  const [data, setData] = useState<{
    title: string;
    description: string;
    answer: string;
    fish_expert_name: string;
    fish_expert_specialization: string;
    fish_type: string;
    fish_length: string;
    fish_age: string;
    fish_image: string;
    answer_image: string;
  } | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:9000/consultations/${consultationId}`);
        if (!response.ok) {
          throw new Error('Gagal memuat data');
        }
        const result = await response.json();
        console.log("Data konsultasi:", result);
        setData(result);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [consultationId]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <p className="text-xl font-semibold text-gray-600">Memuat data...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <p className="text-xl font-semibold text-red-600">Terjadi kesalahan saat memuat data.</p>
      </div>
    );
  }

  // Add base URL for images
  const baseUrl = 'http://localhost:9000';
  const fishImageUrls = JSON.parse(data.fish_image || '[]').map((image: string) => `${baseUrl}${image}`);
  let fishImageUrl: string[] = [];
    try {
      fishImageUrl = data.answer_image && data.answer_image.startsWith('[') 
        ? JSON.parse(data.answer_image).map((image: string) => `${baseUrl}${image}`)
        : [];
    } catch {
      fishImageUrl = [];
    }

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
      <main className="flex-1">
        {/* Judul dan Sub-Judul */}
        <div className="ml-6 mt-32 font-sans">
          <h1 className="text-2xl font-bold mb-2 text-[#1A83FB] text-center">
            Konsultasi Masalah Ikan Anda
          </h1>
          <h2 className="text-base mb-6 font-semibold text-[#2C2C2C] text-center">
            Masukkan keluhan Anda dan dapatkan solusi dari tenaga ahli.
          </h2>
        </div>

        {/* Dua Kotak: Complaint dan Answer */}
        <div className="flex flex-col md:flex-row justify-center gap-8 mt-20 mx-6 font-sans">
          <Complaint 
            title={data.title} 
            description={data.description} 
            fishType={data.fish_type} 
            fishLength={data.fish_length} 
            fishAge={data.fish_age} 
            fishImageUrls={fishImageUrls} 
          />

          <Answer
            toggleModal={toggleModal}
            answer={data.answer}
            fishImageUrls={fishImageUrl}
            name={data.fish_expert_name}
            specialization={data.fish_expert_specialization}
          />
        </div>
        <div className="mt-10 mx-auto w-full max-w-4xl px-4">
          <ChatConsultation consultationId={consultationId} />
        </div>

      </main>

      {/* Modal Placeholder */}
      {isModalOpen && (
        <DetailResep
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          consultationId={consultationId}
        />
      )}
      {/* Footer */}
      <Footer />
    </div>
  );
}
