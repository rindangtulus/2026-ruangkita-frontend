# 🌸 RuangKita - Frontend Web Dashboard

RuangKita adalah platform manajemen peminjaman ruangan di lingkungan PENS yang dirancang dengan antarmuka modern, responsif, dan estetik. Dashboard ini memungkinkan mahasiswa melakukan reservasi ruangan dan admin untuk mengelola izin peminjaman secara efisien.

## ✨ Fitur Utama
- **Role-Based Access Control**: Perbedaan akses antara Admin dan User (Mahasiswa).
- **Smart Booking System**: Validasi waktu otomatis untuk mencegah jadwal bentrok (Zero-Conflict).
- **Katalog Ruangan**: User bisa melihat detail fasilitas dan kapasitas ruangan secara real-time.
- **Manajemen Profil**: Pengaturan nama lengkap dan password secara mandiri.
- **Export Reports**: Pencatatan laporan peminjaman ke format PDF.
- **Status History**: Pelacakan riwayat perubahan status peminjaman (Pending, Approved, Rejected).

## 🛠️ Tech Stack
- **Library Utama**: React.js dengan TypeScript
- **Styling**: Tailwind CSS
- **Networking**: Axios
- **Reporting**: jsPDF & jsPDF-AutoTable
- **Icons**: Lucide React / HeroIcons

## 🚀 Memulai (Setup)

1. **Clone repositori**
   ```bash
   git clone [https://github.com/username/ruangkita-frontend.git](https://github.com/username/ruangkita-frontend.git)
2. **Install depedensi**
   ```bash
   npm install
4. **Konfigurasi API**
   ```bash
   http://localhost:5276/api
5. **Jalankan aplikasi**
    ```bash
   npm run dev
