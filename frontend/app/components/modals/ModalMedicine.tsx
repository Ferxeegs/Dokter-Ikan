'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Medicine {
  medicine_id: number;
  vendor_id: number;
  medicine_name: string;
  contain: string;
  dosage: string;
  medicine_image: string;
}

interface ModalObatProps {
  isOpen: boolean;
  toggleModal: () => void;
  consultationId: string;
}


const ModalObat: React.FC<ModalObatProps> = ({ isOpen, toggleModal, consultationId }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [instruction, setInstruction] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
  const fetchMedicines = async () => {
    if (!isOpen) return;

    try {
      const response = await fetch(`${API_BASE_URL}/medicines`, {
        credentials: 'include', // ⬅️ penting agar cookie HttpOnly terkirim
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil daftar obat");
      }

      const data = await response.json();
      setMedicines(data.data || []);
    } catch (error) {
      console.error("Error fetching medicines:", error);
    }
  };

  fetchMedicines();
}, [isOpen, API_BASE_URL]);

const handleSelectMedicine = (medicine_id: number) => {
  setSelectedMedicines((prev) =>
    prev.includes(medicine_id)
      ? prev.filter((id) => id !== medicine_id)
      : [...prev, medicine_id]
  );
};

const handleConfirm = async () => {
  if (!consultationId) {
    alert("ID konsultasi tidak ditemukan.");
    return;
  }

  if (selectedMedicines.length === 0) {
    alert("Pilih minimal satu obat.");
    return;
  }

  const requestPayload = {
    consultation_id: consultationId,
    instruction,
    medicines: selectedMedicines,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/prescriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // ⬅️ penting agar cookie HttpOnly terkirim
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menambahkan resep");
    }

    setShowConfirmation(false);
    toggleModal();
  } catch (error) {
    console.error("Error submitting prescription:", error);
    alert(error instanceof Error ? error.message : "Gagal mengirim resep.");
  }
};

  if (!isOpen) return null;

  // Filter daftar obat berdasarkan searchQuery
  const filteredMedicines = medicines.filter((item) =>
    item.medicine_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" onClick={toggleModal}>
      <div
        className="bg-white p-6 rounded-xl w-[90%] md:w-[60%] max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4 text-center text-black">Rekomendasi Obat</h2>

        <input
          type="text"
          placeholder="Cari obat..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-lg text-black"
        />

        <div className="max-h-[50vh] overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMedicines.map((item) => (
              <div
                key={item.medicine_id}
                className={`flex items-center p-4 bg-gradient-to-r from-[#DCF5FF] to-[#80B7F5] rounded-lg shadow cursor-pointer ${selectedMedicines.includes(item.medicine_id) ? 'border-2 border-blue-500' : ''
                  }`}
                onClick={() => handleSelectMedicine(item.medicine_id)}
              >
                <Image
                  src={item.medicine_image}
                  alt={item.medicine_name}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-lg object-cover"
                  unoptimized={true}
                />
                <div className="ml-4">
                  <h3 className="font-bold text-black text-xs">{item.medicine_name}</h3>
                  <p className="text-xs text-gray-700">{item.contain}</p>
                  <p className="text-xs text-gray-700">{item.dosage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <textarea
          placeholder="Tambahkan instruksi..."
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          className="w-full px-4 py-2 mt-4 border rounded-lg text-black"
          rows={3}
        ></textarea>

        <button
          className="mt-4 bg-[#1A83FB] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full"
          onClick={() => setShowConfirmation(true)}
        >
          Kirim Resep ke Klien
        </button>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg text-black font-semibold mb-4">Apakah Anda yakin dengan resep yang diberikan?</p>
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2" onClick={handleConfirm}>OK</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg" onClick={() => setShowConfirmation(false)}>Batal</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalObat;