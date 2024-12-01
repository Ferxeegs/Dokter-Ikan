import Link from "next/link";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import Image from "next/image";
import CardRiwayat from "../components/card-riwayat";
import CardPayment from "../components/card-payment";


export default function Payment() {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar/>

        <main
          className="flex flex-col items-center justify-center text-center "
          style={{
            backgroundImage: "linear-gradient(to top, rgba(154, 201, 252, 1) 0.5%, rgba(255, 255, 255, 1) 80%), linear-gradient(to bottom, rgba(255, 255, 255, 1) 100%, rgba(255, 255, 255, 1) 80%)",
            backgroundSize: "cover",
            minHeight: "10vh",
            paddingTop: "5rem",  
          }}
        >
          
        <div className="flex flex-col min-h-screen w-11/12 border-4">   
          <div className="flex items-center justify-center mt-8 mx-10">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <div className="flex-grow h-1 bg-blue-500"></div>
            <div className="text-blue-500 text-xl font-bold mx-4">Ringkasan Pembayaran</div>
            <div className="flex-grow h-1 bg-blue-500"></div>
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
          </div>

          <CardPayment/>

        </div>


          
      </main>

      {/* Footer */}
      <Footer/>
    </div>
    );
  }