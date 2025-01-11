import React from 'react';

interface ComplaintProps {
  title: string; // Tambahkan properti title
  description: string;
}

const Complaint: React.FC<ComplaintProps> = ({ title, description }) => {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[40%] h-72 border-4 border-[#1A83FB] overflow-y-auto">
      <h3 className="text-xl font-bold text-black mb-4 text-center">
        {title || 'Judul keluhan akan muncul di sini.'} {/* Tampilkan judul dinamis */}
      </h3>
      <p className="text-sm text-gray-700 text-justify">
        {description || 'Deskripsi akan muncul di sini setelah Anda mengirimkan keluhan.'}
      </p>
    </div>
  );
};

export default Complaint;
