import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function Riwayat() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main
        className="flex-1 flex flex-col items-center"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(154, 201, 252, 1) 0.5%, rgba(255, 255, 255, 1) 80%), linear-gradient(to bottom, rgba(255, 255, 255, 1) 100%, rgba(255, 255, 255, 1) 80%)",
          backgroundSize: "cover",
          paddingTop: "5rem",
        }}
      >
        {/* Profil Dokter */}
        <div className="w-full max-w-4xl px-6 flex flex-col md:flex-row items-center bg-white rounded-lg shadow-lg py-6 mb-10">
          <div className="flex-shrink-0">
            <img
              src="/path-to-image" // Ganti dengan path gambar profil dokter
              alt="Profil Dokter"
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-[#1A83FB]">Drh. Diva Putri</h2>
            <p className="text-gray-600">Dokter Hewan</p>
            <p className="text-gray-500 mt-2">
              Universitas Diponegoro | Pengalaman Kerja 5 Tahun
            </p>
            <p className="text-gray-500">Nomor STR: 230012373813</p>
            <div className="mt-4 flex gap-2">
              <span className="px-3 py-1 bg-[#1A83FB] text-white rounded-full text-sm">Ikan Air Tawar</span>
              <span className="px-3 py-1 bg-[#1A83FB] text-white rounded-full text-sm">Ikan Laut</span>
              <span className="px-3 py-1 bg-[#1A83FB] text-white rounded-full text-sm">Penyakit Kulit</span>
            </div>
          </div>
        </div>

        {/* Riwayat Konsultasi */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2 text-[#1A83FB]">Dashboard Tenaga Ahli</h1>
          <p className="text-lg text-[#2C2C2C]">
            Berikut adalah daftar riwayat konsultasi yang diajukan ke anda
          </p>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Kartu Riwayat 1 */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#1A83FB] mb-2">Ikan berenang melingkar</h3>
            <p className="text-gray-600 mb-4">
              Gejala ini sering terjadi pada ikan dengan gangguan pada sistem saraf atau infeksi parasit.
            </p>
            <button className="px-4 py-2 bg-[#1A83FB] text-white rounded-lg">Detail</button>
          </div>

          {/* Kartu Riwayat 2 */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#1A83FB] mb-2">Muncul bercak merah pada kulit ikan</h3>
            <p className="text-gray-600 mb-4">
              Bercak merah pada ikan biasanya merupakan tanda infeksi bakteri atau luka akibat gesekan.
            </p>
            <button className="px-4 py-2 bg-[#1A83FB] text-white rounded-lg">Detail</button>
          </div>

          {/* Kartu Riwayat 3 */}
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-[#1A83FB] mb-2">Terdapat perubahan perilaku ikan</h3>
            <p className="text-gray-600 mb-4">
              Ikan yang tidak aktif atau sering bersembunyi dapat mengalami stres atau kondisi kesehatan yang buruk.
            </p>
            <button className="px-4 py-2 bg-[#1A83FB] text-white rounded-lg">Detail</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
