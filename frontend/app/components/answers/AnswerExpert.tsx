import React from 'react';
import Image from 'next/image';

interface AnswerProps {
  answer: string; // Properti untuk jawaban tenaga ahli
  name: string; // Properti untuk nama tenaga ahli
  specialization: string; // Properti untuk spesialisasi tenaga ahli
}

const Answer: React.FC<AnswerProps> = ({ answer, name, specialization }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[40%] h-72 border-4 border-[#1A83FB] overflow-y-auto relative">
      <h3 className="text-xl font-bold text-black mb-4 text-center">
        Jawaban Tenaga Ahli
      </h3>
      
      {/* Jawaban Tenaga Ahli */}
      <p className="text-sm text-gray-700 text-justify mb-8">
        {answer || 'Jawaban akan muncul di sini setelah tenaga ahli memberikan respons.'}
      </p>

      {/* Foto Profil dan Informasi Tenaga Ahli */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
        <Image src="/images/icon/ic_profile.png" alt="Foto Profil" width={40} height={40} className="rounded-full" />
        <div className="flex flex-col text-left font-sans">
          <span className="text-sm font-bold text-black">{name || 'Nama Tenaga Ahli'}</span>
          <span className="text-xs font-light text-black italic">
            {specialization || 'Spesialisasi'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Answer;