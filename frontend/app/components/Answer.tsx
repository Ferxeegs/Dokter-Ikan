// components/jawaban.tsx
import React from 'react';

interface AnswerProps {
  toggleModal: () => void;
}

const Answer: React.FC<AnswerProps> = ({ toggleModal }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[40%] h-56 border-4 border-[#1A83FB] overflow-y-auto relative">
      <h3 className="text-xl font-bold text-black mb-4 text-center">
        Jawaban Tenaga Ahli
      </h3>
      <p className="text-sm text-gray-700 text-justify mb-8">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent luctus purus at lacus pharetra suscipit.
      </p>

      {/* Button untuk melihat detail resep */}
      <button
        className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl text-xs font-bold"
        style={{
          backgroundColor: 'rgba(105, 203, 244, 0.3)',
          color: 'black',
        }}
        onClick={toggleModal}
      >
        Lihat Detail Resep
      </button>

      {/* Foto Profil */}
      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
        <img src="profil.png" alt="Foto Profil" className="w-10 h-10 rounded-full" />
        <div className="flex flex-col text-left font-sans">
          <span className="text-sm font-bold text-black">Nama Tenaga Ahli</span>
          <span className="text-xs font-light text-black italic">Spesialis Ikan</span>
        </div>
      </div>
    </div>
  );
};

export default Answer;
