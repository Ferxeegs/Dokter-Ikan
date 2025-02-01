'use client';

import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';
import Cookies from 'js-cookie';

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
  consultationId: string; // Terima consultationId dari props
}

// Definisikan tipe untuk hasil decode token
interface DecodedToken {
  id: number; // Ganti 'fishExperts_id' menjadi 'id'
}

const ModalObat: React.FC<ModalObatProps> = ({ isOpen, toggleModal, consultationId }) => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedMedicines, setSelectedMedicines] = useState<number[]>([]);

  const token = Cookies.get('token'); // Mengambil token dari localStorage

  let expert_id: number | null = null;

  // Decode token hanya jika token ada
  if (token) {
    try {
      const decoded = jwt_decode<DecodedToken>(token); // Casting hasil decode
      expert_id = decoded.id; // Ambil 'id' dari token
      console.log('Decoded token:', decoded); // Log token yang sudah didekode
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:9000/medicines')
        .then(response => response.json())
        .then(data => {
          console.log('Fetched medicines:', data); // Log data obat yang diambil
          setMedicines(data);
        })
        .catch(error => console.error('Error fetching medicines:', error));
    }
  }, [isOpen]);

  const handleSelectMedicine = (medicine_id: number) => {
    setSelectedMedicines((prev) =>
      prev.includes(medicine_id) ? prev.filter(id => id !== medicine_id) : [...prev, medicine_id]
    );
  };

  const handleSubmit = async () => {
    if (!consultationId || !expert_id) {
      alert('Gagal mendapatkan ID konsultasi atau ID ahli ikan.');
      return;
    }

    const requestPayload = {
      consultation_id: consultationId, // Gunakan consultationId dari props
      fishExperts_id: expert_id,  // Menggunakan 'id' yang didekode dari token
    };

    console.log('Request payload for prescription:', requestPayload); // Log data request untuk prescription

    try {
      const prescriptionResponse = await fetch('http://localhost:9000/prescriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
      });

      if (!prescriptionResponse.ok) {
        throw new Error('Gagal menambahkan prescription');
      }

      const prescriptionData = await prescriptionResponse.json();
      console.log('Prescription created:', prescriptionData); // Log data prescription yang diterima

      const prescription_id = prescriptionData.prescription_id;

      const medicinePayloads = selectedMedicines.map(medicine_id => ({
        prescription_id,
        medicine_id,
      }));

      console.log('Medicine payloads:', medicinePayloads); // Log payload obat yang akan dikirimkan

      await Promise.all(medicinePayloads.map(payload =>
        fetch('http://localhost:9000/prescriptions-medicines', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      ));

      alert('Resep telah dikirim ke klien.');
      toggleModal();
    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('Gagal mengirim resep.');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={toggleModal}
    >
      <div
        className="bg-white p-6 rounded-xl w-[80%] md:w-[50%] max-h-[70vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Rekomendasi Obat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {medicines.map((item) => (
            <div
              key={item.medicine_id}
              className={`flex items-center p-4 bg-gradient-to-r from-[#DCF5FF] to-[#80B7F5] rounded-lg shadow cursor-pointer ${selectedMedicines.includes(item.medicine_id) ? 'border-2 border-blue-500' : ''}`}
              onClick={() => handleSelectMedicine(item.medicine_id)}
            >
              <img
                src={`http://localhost:9000/${item.medicine_image}`}
                alt={item.medicine_name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="ml-4">
                <h3 className="font-bold text-black text-xs">{item.medicine_name}</h3>
                <p className="text-xs text-gray-700">{item.contain}</p>
                <p className="text-xs text-gray-700">{item.dosage}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button
            className="bg-[#1A83FB] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold"
            onClick={handleSubmit}
          >
            Kirim Resep ke Klien
          </button>
        </div>

        <button
          className="absolute top-2 right-2 text-black font-bold text-lg"
          onClick={toggleModal}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default ModalObat;
