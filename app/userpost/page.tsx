    import Navbar from '../components/navbar';
    import Footer from '../components/footer';

    export default function UserPost() {
    return (
        <div
        className="flex flex-col min-h-screen"
        style={{
            backgroundColor: "white",
        }}
        >
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1">
            {/* Judul dan Sub-Judul */}
            <div className="ml-6 mt-32"> {/* Menambahkan margin atas lebih besar */}
  <h1 className="text-2xl font-bold mb-2 text-[#1A83FB] text-center">
  Posting Keluhan Anda Disini!  </h1>
  <h2 className="text-base mb-6 font-semibold text-[#2C2C2C] text-center">
  Masukan gejala - gejala yang diderita oleh ikan seperti perubahan pada fisik dan perilaku ikan  </h2>
</div>

        <div className="flex flex-col md:flex-row justify-center gap-8 mt-20 mx-6">
        {/* Kotak 1 */}
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[40%] h-72 border-4 border-[#1A83FB] overflow-y-auto"> {/* Tambahkan overflow-y-auto */}
            <h3 className="text-xl font-bold text-black mb-4 text-center">Muncul Bintik Putih</h3>
            <p className="text-sm text-gray-700 text-justify"> {/* Tambahkan text-justify */}
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using.
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using.  
            </p>
        </div>

        {/* Kotak 2 */}
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full md:w-[40%] h-56 border-4 border-[#1A83FB] overflow-y-auto"> {/* Tambahkan overflow-y-auto */}
            <h3 className="text-xl font-bold text-black mb-4 text-center">Jawaban Tenaga Ahli</h3>
            <p className="text-sm text-gray-700 text-justify"> {/* Tambahkan text-justify */}
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using.
            It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.  
            </p>
        </div>
        </div>


            {/* Button di bawah Kotak 2 */}
            <div className="flex justify-center mt-6">
  <button className="bg-[rgba(105,203,244,0.4)] text-black px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold flex items-center gap-2">
    {/* Gambar sebagai ikon di kiri */}
    <img src="crown.png" alt="Icon" className="w-6 h-6" />
    
    {/* Teks di kanan, dengan 2 baris */}
    <div className="flex flex-col text-left">
      <span className="font-light text-xs italic ">Punya pertanyaan lebih lanjut?</span> {/* Teks atas tipis */}
      <span className="font-bold">Chat Tenaga Ahli Sekarang!</span> {/* Teks bawah tebal */}
    </div>
  </button>
</div>



            {/* Kotak Input */}
            <div className="mt-8 flex justify-center">
  <div className="flex items-center w-[80%] h-32 p-4 border-2 border-[#0795D2] rounded-lg shadow-md">
    {/* Foto Profil */}
    <img
      src="profil.png" // Ganti dengan path gambar Anda
      alt="Foto Profil"
      className="w-12 h-12 rounded-full ml-8 mr-4"
    />
    {/* Kotak Teks */}
    <textarea
      className="flex-1 h-full p-4 rounded-lg outline-none"
      placeholder="Masukkan detail keluhan atau informasi tambahan mengenai kondisi ikan Anda..."
    />
  </div>
</div>






            {/* Empat Button Berderet */}
            <div className="flex gap-4 justify-center mt-6 mx-6">
            <button className="bg-[#69CBF4] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full md:w-auto">
                Button 1
            </button>
            <button className="bg-[#69CBF4] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full md:w-auto">
                Button 2
            </button>
            <button className="bg-[#69CBF4] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full md:w-auto">
                Button 3
            </button>
            <button className="bg-[#69CBF4] text-white px-6 py-2 rounded-lg hover:bg-[#4AABDE] transition text-sm font-semibold w-full md:w-auto">
                Button 4
            </button>
            </div>
        </main>

        {/* Footer */}
        <Footer />
        </div>
    );
    }
