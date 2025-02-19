'use client';

import { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';
import Navbar from '../../../components/layout/Navbar';
import Footer from '../../../components/layout/Footer';
import Complaint from '@/app/components/complaints/Complaint';
import Answer from '@/app/components/answers/AnswerExpert';
import UploadFotoButton from '@/app/components/uploads/UploadFoto';
import UploadFileButton from '@/app/components/uploads/UploadFile';
import ModalObat from '@/app/components/modals/ModalMedicine';
import { useParams } from 'next/navigation';
import Modal from '@/app/components/modals/ModalPost';
import ChatExpert from '@/app/components/chat/ChatExpert';
import Image from 'next/image';

type Params = {
  id: string;
};

export default function ExpertPost() {
  const { id } = useParams() as Params;
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
    name: string;
    created_at: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isModalPostOpen, setIsModalPostOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleCloseModal = () => {
    setIsModalPostOpen(false);
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
 const handleSubmit = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setModalMessage("Token tidak ditemukan. Silakan login ulang.");
        setIsModalPostOpen(true);
        return;
      }

      const decoded: { id: string } = jwtDecode(token);
      const fishExpert_id = decoded.id;
      const timestamp = new Date().toISOString();

      const answerResponse = await fetch(
        `${API_BASE_URL}/fish-expert-answers`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fishExpert_id,
            answer: inputText,
            image: JSON.stringify(imageUrls),
            timestamp,
          }),
        }
      );

      if (!answerResponse.ok) {
        throw new Error("Kolom jawaban tidak boleh kosong!");
      }

      const answerResult = await answerResponse.json();
      const fish_expert_answer_id = answerResult.newAnswer.fish_expert_answer_id;

      const consultationUpdateResponse = await fetch(
        `${API_BASE_URL}/consultations/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fish_expert_answer_id,
            consultation_status: "In Consultation",
          }),
        }
      );

      if (!consultationUpdateResponse.ok) {
        throw new Error("Gagal memperbarui konsultasi.");
      }

      setModalMessage("Jawaban berhasil dikirim");
      setIsModalPostOpen(true);
      setInputText(""); // Reset input setelah sukses
    } catch (error) {
      setModalMessage((error as Error).message || "Terjadi kesalahan.");
      setIsModalPostOpen(true);
    }
  };

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/consultations/${id}`);
        if (!response.ok) {
          throw new Error('Gagal memuat data');
        }
        const result = await response.json();
        setData(result);
      } catch {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, API_BASE_URL]);

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

  const baseUrl =  `${API_BASE_URL}`;
  const fishImageUrls = JSON.parse(data.fish_image || '[]').map((image: string) => `${baseUrl}${image}`);

  const handleDeleteImage = async (url: string) => { // Terima URL gambar yang akan dihapus
    const token = Cookies.get("token");
    if (!token) {
      console.error("Token tidak ditemukan di cookies");
      return;
    }
  
    try {
      // Ambil nama file dari URL gambar
      const fileName = url.split("/").pop();
  
      // Kirim request ke backend untuk menghapus gambar dari server lokal
      const response = await fetch(`${API_BASE_URL}/delete-file`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileName: fileName, // Kirim nama file ke backend
        }),
      });
  
      const responseData = await response.json();
      if (response.ok) {
        // Hapus gambar dari state imageUrls setelah berhasil dihapus dari server
        setImageUrls(imageUrls.filter((imageUrl) => imageUrl !== url)); // Filter gambar yang tidak dihapus   
      } else {
        console.error("Error menghapus gambar:", responseData);
      }
    } catch (error) {
      console.error("Error saat menghapus gambar:", error);
    }
  };

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
          <Complaint 
            title={data.title} 
            description={data.description} 
            fishType={data.fish_type} 
            fishLength={data.fish_length} 
            fishAge={data.fish_age} 
            fishImageUrls={fishImageUrls} 
            senderName={data.name}
            consultationDate={data.created_at}
          />

          <Answer
            answer={data.answer}
            name={data.fish_expert_name}
            specialization={data.fish_expert_specialization}
          />
        </div>
        {!data?.answer || data.answer === "Belum ada jawaban dari ahli ikan" ? (
        <div className="flex justify-center mt-6">
          <button
            className="bg-[rgba(105,203,244,0.4)] text-black px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold flex items-center gap-2"
            onClick={toggleModal}
          >
            <Image src="/images/icon/ic_obat.png" alt="Icon" width={24} height={24} />
            <div className="flex flex-col text-left font-sans">
              <span className="font-light text-xs italic">Ayo bantu klien lebih lanjut</span>
              <span className="font-bold text-sm">Berikan resep obat disini!</span>
            </div>
          </button>
        </div>
        ):null}
        <ModalObat isOpen={isModalOpen} toggleModal={toggleModal} consultationId={id} />
        {!data?.answer || data.answer === "Belum ada jawaban dari ahli ikan" ? (
        <div className="flex flex-col w-full p-4 border-2 border-[#0795D2] rounded-lg shadow-md mt-8 max-w-5xl mx-auto justify-center">
            <div className="flex items-center">
              <Image
                src="/images/icon/ic_profile.png"
                alt="Foto Profil"
                width={48}
                height={48}
                className="rounded-full ml-4 mr-4"
                unoptimized={true}
              />
              <textarea
                className="flex-1 w-full h-32 p-4 rounded-lg outline-none resize-none text-black font-sans bg-white"
                placeholder="Masukkan jawaban dari keluhan..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </div>
            {/* Menampilkan gambar yang diupload */}
            {imageUrls.length > 0 && (
              <div className="relative mt-4 flex justify-start ml-24">
                {imageUrls.map((url: string, index: number) => (
                  <div key={index} className="w-24 h-24 border rounded-lg overflow-hidden mr-4 relative">
                    {/* Tombol silang di pojok kanan atas */}
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-md hover:bg-red-700 transition"
                      onClick={() => handleDeleteImage(url)} // Hapus gambar berdasarkan URL
                    >
                      ✕
                    </button>

                    {/* Gambar yang diupload */}
                    <Image src={`${API_BASE_URL}${url}`} alt="Uploaded" layout="fill" objectFit="cover" unoptimized={true}/>
                  </div>
                ))}
              </div>
            )}
          </div>
          ):null}

        {!data?.answer || data.answer === "Belum ada jawaban dari ahli ikan" ? (
        <div className="flex gap-12 justify-center mt-6 mx-6 font-sans">
          <UploadFotoButton />
          <UploadFileButton setImageUrls={setImageUrls} />
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#BCEBFF] to-[#1A83FB] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full md:w-auto flex items-center justify-center space-x-2"
          >
            <Image src="/images/icon/ic_send.png" alt="Kirim" width={16} height={16} />
            <span>Kirim</span>
          </button>
          {isModalPostOpen && <Modal message={modalMessage} onClose={handleCloseModal} />}
        </div>
        ):null}

        <div className="mt-10 mx-auto w-full max-w-4xl px-4">
          <ChatExpert consultationId={id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}