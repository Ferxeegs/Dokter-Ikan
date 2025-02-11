import React, { useState } from 'react';

interface AnswerProps {
  answer: string;
  name: string;
  specialization: string;
  fishImageUrls?: string[];
  toggleModal: () => void;
  consultation_status: string; // Properti untuk status konsultasi
}

const Answer: React.FC<AnswerProps> = ({ answer, name, specialization, fishImageUrls = [], toggleModal, consultation_status }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const openModal = (image: string) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[40%] h-72 border-4 border-[#1A83FB] overflow-y-auto relative">
      <h3 className="text-xl font-bold text-black mb-4 text-center">
        Jawaban Tenaga Ahli
      </h3>
      
      <p className="text-sm text-gray-700 text-justify mb-8">
        {answer || 'Jawaban akan muncul di sini setelah tenaga ahli memberikan respons.'}
      </p>
      <div className="flex space-x-2">
        {fishImageUrls.length > 0 ? (
          fishImageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Fish Image ${index + 1}`}
              className="w-24 h-24 object-cover rounded-lg cursor-pointer"
              onClick={() => openModal(url)}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500"></p>
        )}
      </div>

      {isModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleOverlayClick}>
          <div className="relative bg-white p-4 rounded-lg">
            <span onClick={closeModal} className="absolute top-0 right-0 p-2 cursor-pointer text-black font-bold">X</span>
            <img src={selectedImage} alt="Selected Fish" className="max-w-[80vw] max-h-[80vh] object-contain" />
          </div>
        </div>
      )}

      {/* Button hanya muncul jika consultation_status adalah "Closed" */}
      {consultation_status === "Closed" && (
        <button
          className="absolute bottom-4 right-4 px-4 py-2 rounded-2xl text-xs font-bold"
          style={{ backgroundColor: 'rgba(105, 203, 244, 0.3)', color: 'black' }}
          onClick={toggleModal}
        >
          Lihat Detail Resep
        </button>
      )}

      <div className="absolute bottom-4 left-4 flex items-center space-x-2">
        <img src="/images/icon/ic_profile.png" alt="Foto Profil" className="w-10 h-10 rounded-full" />
        <div className="flex flex-col text-left font-sans">
          <span className="text-sm font-bold text-black">{name || 'Nama Tenaga Ahli'}</span>
          <span className="text-xs font-light text-black italic">{specialization || 'Spesialisasi'}</span>
        </div>
      </div>
    </div>
  );
};

export default Answer;
