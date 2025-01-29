import Navbar from "../components/navbar";
import Footer from "../components/footer";
import CardRiwayat from "../components/card-riwayat";

export default function Riwayat() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main
        className="flex-1 flex flex-col items-center justify-center text-center "
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(154, 201, 252, 1) 0.5%, rgba(255, 255, 255, 1) 80%), linear-gradient(to bottom, rgba(255, 255, 255, 1) 100%, rgba(255, 255, 255, 1) 80%)",
          backgroundSize: "cover",
          minHeight: "10vh",
          paddingTop: "5rem",
        }}
      >
        <div className="ml-6 text-center justify-center">
          <h1 className="text-3xl font-bold mb-2 text-[#1A83FB] font-lato text-center">
            Riwayat Konsultasi
          </h1>
          <h2 className="text-lg text-[#2C2C2C]">
            Masukan gejala - gejala yang diderita oleh ikan seperti perubahan pada fisik dan perilaku ikan
          </h2>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <CardRiwayat />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
