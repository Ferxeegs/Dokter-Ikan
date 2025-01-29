'use client';

import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import Navbar from '../../../components/navbar';
import Footer from '../../../components/footer';
import Complaint from '@/app/components/complaint';
import Answer from '@/app/components/answer-expert';
import UploadFotoButton from '@/app/components/upload-foto';
import UploadVideoButton from '@/app/components/upload-video';
import UploadFileButton from '@/app/components/upload-file';
import ModalObat from '@/app/components/modalmedicine';
import { useParams } from 'next/navigation';

type Params = {
  id: string;
};

export default function ExpertPost() {
  const { id } = useParams() as Params; // Tipe eksplisit untuk useParams()
  const [data, setData] = useState<{
    title: string;
    description: string;
    answer: string;
    fish_expert_name: string;
    fish_expert_specialization: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State untuk modal
  const [inputText, setInputText] = useState(''); // State untuk textarea input

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal open/close
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token tidak ditemukan di localStorage');
        return;
      }
  
      const decoded: { id: string } = jwtDecode(token);
      const fishExpert_id = decoded.id;
      const timestamp = new Date().toISOString();
  
      // Kirim jawaban ke tabel fish-expert-answers
      const answerResponse = await fetch('http://localhost:9000/fish-expert-answers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fishExpert_id,
          answer: inputText,
          timestamp,
        }),
      });
  
      if (!answerResponse.ok) {
        throw new Error('Gagal mengirim jawaban');
      }
  
      const answerResult = await answerResponse.json();
      console.log('Answer Result:', answerResult);
  
      // Ambil ID dari jawaban yang baru saja dibuat
      const fish_expert_answer_id = answerResult.newAnswer.fish_expert_answer_id;
      console.log('fish_expert_answer_id:', fish_expert_answer_id);
  
      // Update tabel consultations
      const consultationUpdateResponse = await fetch(`http://localhost:9000/consultations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fish_expert_answer_id,
          consultation_status: 'Selesai',
        }),
      });
  
      if (!consultationUpdateResponse.ok) {
        throw new Error('Gagal memperbarui konsultasi');
      }
  
      console.log('Konsultasi berhasil diperbarui');
      setInputText(''); // Reset input setelah kirim
    } catch (error) {
      console.error('Terjadi kesalahan:', error);
    }
  };

  useEffect(() => {
    if (!id) return; // Pastikan id tersedia sebelum fetch data

    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:9000/consultations/${id}`);
        if (!response.ok) {
          throw new Error('Gagal memuat data');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

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
      <Navbar />

      <main className="flex-1">
        <div className="ml-6 mt-32 font-sans">
          <h1 className="text-2xl font-bold mb-2 text-[#1A83FB] text-center">
            Konsultasi Masalah Ikan Anda
          </h1>
          <h2 className="text-base mb-6 font-semibold text-[#2C2C2C] text-center">
            Masukkan keluhan Anda dan dapatkan solusi dari tenaga ahli.
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-center gap-8 mt-20 mx-6 font-sans">
          <Complaint title={data.title} description={data.description} />

          <Answer
            toggleModal={toggleModal}
            answer={data.answer}
            name={data.fish_expert_name}
            specialization={data.fish_expert_specialization}
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            className="bg-[rgba(105,203,244,0.4)] text-black px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold flex items-center gap-2"
            onClick={toggleModal}
          >
            <img src="obat.png" alt="Icon" className="w-6 h-6" />
            <div className="flex flex-col text-left font-sans">
              <span className="font-light text-xs italic">Ayo bantu klien lebih lanjut</span>
              <span className="font-bold text-sm">Berikan resep obat disini!</span>
            </div>
          </button>
        </div>

        <ModalObat isOpen={isModalOpen} toggleModal={toggleModal} consultationId={id} />

        <div className="flex items-center w-full h-32 p-4 border-2 border-[#0795D2] rounded-lg shadow-md mt-6">
          <img src="profil.png" alt="Foto Profil" className="w-12 h-12 rounded-full ml-8 mr-4" />
          <textarea
            className="flex-1 h-full p-4 rounded-lg outline-none resize-none text-black font-sans bg-white"
            placeholder="Masukkan jawaban dari keluhan yang diberikan klien..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>

        <div className="flex gap-12 justify-center mt-6 mx-6 font-sans">
          <UploadFotoButton />
          <UploadVideoButton />
          <UploadFileButton />
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#BCEBFF] to-[#1A83FB] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full md:w-auto flex items-center justify-center space-x-2"
          >
            <img src="../send.png" alt="Kirim" className="w-4 h-4" />
            <span>Kirim</span>
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
