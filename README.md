# 🪙 Mini Koperasi (Artha Mulia) - Sistem Manajemen Keuangan Modern

Sistem manajemen keuangan koperasi simpan pinjam berbasis web modern (Single Page Application) yang dirancang untuk memudahkan pencatatan keanggotaan, simpanan, pinjaman, angsuran, serta penyusunan laporan keuangan secara realtime. Aplikasi ini menggunakan **Vanilla JavaScript, HTML5, dan CSS3 kustom** dengan penyimpanan lokal (**LocalStorage**) untuk kemudahan penggunaan tanpa ketergantungan server luar (serverless client-side prototype).

---

## 🚀 Fitur Utama

Aplikasi Mini Koperasi dilengkapi dengan berbagai modul keuangan esensial:

1. **📊 Dashboard Keuangan Dinamis**
   - Ringkasan statistik utama secara realtime (Total Saldo Kas, Total Simpanan, Total Pinjaman Aktif, dan Jumlah Anggota).
   - Grafik Interaktif menggunakan **Chart.js**:
     - *Grafik Tren Transaksi Bulanan* (Setoran vs Penarikan vs Angsuran).
     - *Grafik Distribusi Simpanan* (Persentase Simpanan Pokok, Wajib, dan Sukarela).
   - Log Aktivitas Terbaru yang mencakup ringkasan riwayat seluruh transaksi masuk dan keluar.

2. **👥 Manajemen Anggota Lengkap**
   - Pendaftaran anggota baru dengan validasi input.
   - Fitur pencarian anggota secara cepat berdasarkan nama atau nomor anggota.
   - Halaman detail anggota yang menampilkan profil, status keanggotaan (Aktif/Nonaktif), rincian saldo simpanan, serta riwayat pinjaman aktif.
   - Fitur edit data dan hapus anggota.

3. **💰 Transaksi Simpanan Terintegrasi**
   - Mendukung 3 jenis simpanan utama koperasi:
     - **Simpanan Pokok** (Setoran awal saat mendaftar).
     - **Simpanan Wajib** (Iuran bulanan anggota).
     - **Simpanan Sukarela** (Dapat disetor dan ditarik kapan saja).
   - Pencatatan transaksi Setoran dan Penarikan dengan integrasi ke kas utama.
   - Riwayat mutasi simpanan lengkap dengan filter pencarian.

4. **💸 Sistem Pinjaman & Cicilan Angsuran**
   - Formulir pengajuan pinjaman baru dengan kalkulator angsuran otomatis (bunga flat bulanan).
   - Skema persetujuan pinjaman (Status: Pengajuan, Aktif, Lunas, Terlambat).
   - Pencatatan pembayaran angsuran bulanan yang otomatis memotong saldo pinjaman dan memperbarui kas koperasi.
   - Penghitungan denda keterlambatan secara dinamis.

5. **📈 Laporan Keuangan & Buku Jurnal**
   - Arus kas mutasi masuk dan keluar secara kronologis (Buku Jurnal).
   - Perhitungan **Sisa Hasil Usaha (SHU)** berdasarkan pendapatan bunga dan denda.
   - Fitur **Ekspor Laporan ke format CSV** untuk kemudahan pengolahan data di Microsoft Excel atau Google Sheets.
   - Layout halaman cetak laporan yang dioptimalkan untuk dicetak langsung via browser (`Ctrl+P`).

6. **⚙️ Pengaturan Sistem & Manajemen Data**
   - Kustomisasi Nama Koperasi dan Modal Kas Awal.
   - Pengaturan nilai default biaya Simpanan Pokok, Simpanan Wajib, dan persentase bunga pinjaman.
   - Fitur **Inisialisasi Data Demo** untuk mempermudah uji coba aplikasi.
   - Fitur **Backup & Restore Database** (Ekspor/Impor file JSON dari LocalStorage).
   - Fitur **Reset Sistem** untuk menghapus seluruh data secara instan.

---

## 🛠️ Teknologi yang Digunakan

Aplikasi ini dibangun menggunakan tumpukan teknologi modern standar web tanpa dependensi eksternal yang rumit (zero-dependency build):

* **HTML5**: Struktur semantik dengan tata letak modular untuk Single Page Application (SPA).
* **CSS3**: Sistem desain modern dengan **Glassmorphism**, warna harmoni HSL, responsif penuh (Mobile Friendly), dan mikro-animasi halus untuk meningkatkan user experience.
* **Vanilla JavaScript (ES6+)**: Manajemen state aplikasi, routing SPA sederhana, manipulasi DOM, pengolahan matematika keuangan, dan integrasi LocalStorage.
* **Chart.js (CDN)**: Library visualisasi data untuk grafik performa keuangan koperasi.
* **FontAwesome 6 (CDN)**: Library ikon grafis untuk navigasi dan penanda status.

---

## 📁 Struktur Proyek

```bash
koperasi-keuangan-app/
├── index.html          # File utama layout UI & SPA Section
├── app.js              # Logika bisnis core, database state, rendering, & event handler
├── app.css             # Tema styling, variabel CSS, responsivitas, & keyframes
├── dummy-data.js       # Data awal untuk inisialisasi demo database
└── README.md           # Dokumentasi proyek (File Ini)
```

---

## 💾 Struktur Penyimpanan LocalStorage

Aplikasi menggunakan skema database lokal berbasis JSON di browser:

| Key LocalStorage | Tipe Data | Deskripsi |
| --- | --- | --- |
| `koperasi_members` | Array of Object | Data profil anggota koperasi. |
| `koperasi_savings` | Array of Object | Catatan transaksi simpanan pokok, wajib, dan sukarela. |
| `koperasi_loans` | Array of Object | Data pengajuan pinjaman, bunga, durasi, dan status pelunasan. |
| `koperasi_repayments` | Array of Object | Log transaksi angsuran cicilan bulanan dan denda dari pinjaman. |
| `koperasi_settings` | Object | Pengaturan konfigurasi nama koperasi, kas awal, dan parameter bunga. |

---

## ⚙️ Cara Menjalankan Project secara Lokal

Aplikasi ini dapat langsung dijalankan di browser Anda tanpa perlu kompilasi atau instalasi server backend khusus:

### Metode 1: Buka Langsung (Tanpa Server)
1. Unduh atau clone repositori ini:
   ```bash
   git clone https://github.com/atzartech-prog/minikoperasi.git
   ```
2. Masuk ke folder proyek:
   ```bash
   cd minikoperasi
   ```
3. Klik ganda file `index.html` untuk membukanya secara langsung di browser web Anda (Chrome, Edge, Firefox, Safari).

### Metode 2: Menggunakan Local Development Server (Direkomendasikan)
Agar library eksternal (CDN) berjalan optimal dan mencegah isu kebijakan CORS lokal pada beberapa modul advance, Anda bisa menggunakan server lokal sederhana:

* **Menggunakan Node.js (`live-server` atau `serve`):**
  ```bash
  npx live-server
  ```
* **Menggunakan Python (jika terinstall):**
  ```bash
  python -m http.server 8080
  ```
  Kemudian akses `http://localhost:8080` pada browser Anda.

---

## 📸 Panduan Penggunaan Pertama Kali
1. Saat aplikasi pertama kali dibuka, sistem akan otomatis mendeteksi database kosong dan menanyakan/membuat **Data Demo/Dummy**.
2. Anda akan langsung disajikan halaman **Dashboard** yang berisi visualisasi grafik data demo tersebut.
3. Anda dapat mengunjungi menu **Pengaturan** jika ingin membersihkan data demo (`Reset Database`) untuk memulai pencatatan koperasi Anda sendiri dari nol, atau melakukan backup data ke file `.json`.

---

## 📄 Lisensi
Proyek ini didistribusikan secara bebas untuk tujuan pembelajaran, portofolio pribadi, dan pengembangan aplikasi koperasi skala mikro.
