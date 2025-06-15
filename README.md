# 🐟 Dokter Ikan

**Dokter Ikan** adalah Progressive Web App (PWA) yang membantu petambak dan nelayan untuk:
- 🔍 Mendeteksi spesies ikan dari foto.
- 🧪 Mendiagnosis penyakit ikan berdasarkan gejala.
- 🧠 Menggunakan sistem pakar berbasis AI dan inference rule-based.
- 💬 Berkonsultasi dengan tenaga ahli ikan.
- 📄 Mengakses artikel seputar penyakit dan perawatan ikan.

---

## 🚀 Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🐠 **Deteksi Spesies Ikan** | Menggunakan model YOLOv11 (.onnx) untuk mendeteksi 5 spesies: Bawal, Gurame, Lele, Nila, dan Tuna secara **offline**. |
| 🤒 **Diagnosis Penyakit** | Sistem pakar berbasis aturan dan pembobotan gejala untuk mengidentifikasi penyakit. |
| 🧑‍⚕️ **Konsultasi Ahli** | Pengguna dapat berkonsultasi langsung dengan ahli ikan melalui chat. |
| 📚 **Artikel Edukatif** | Tersedia informasi mengenai penyakit dan cara penanganan. |

---

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js (React + TypeScript)
- **Backend**: Express.js (Node.js)
- **AI Model**: YOLOv11 (ONNX & Pytorch)
- **Inference System**: Python (Flask)
- **Database**: MySQL
- **Offline AI Integration**: WebAssembly + IndexedDB
- **Deployment**: Domainesia (dokterikan.com)

---
