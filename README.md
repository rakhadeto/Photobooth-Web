# 🕹️ PIXEL BOOTH — Retro Arcade Photobooth

> Web-based photobooth dengan tema **Retro Arcade / Game** — dibangun dengan HTML, CSS, dan JavaScript murni tanpa framework. Virtual background AI, filters, frames, photo strip, dan QR download!

🔗 **Live Demo:** *(coming soon)*

---

## ✨ Fitur Lengkap

### 📷 Kamera & Capture
- **Live Camera Preview** — akses webcam real-time via browser
- **Jumlah Foto Bebas** — user tentukan sendiri (1–10 foto per sesi)
- **Timer Countdown** — pilih 3, 5, atau 10 detik sebelum foto
- **Retake Photo** — batal foto terakhir dan ambil ulang
- **Input Nama Player** — nama tampil di footer photo strip

### 🌄 Virtual Background (AI)
Menggunakan **MediaPipe Selfie Segmentation** (Google AI) untuk memisahkan orang dari background secara real-time — sama seperti Microsoft Teams / Zoom. Pinggiran badan di-feather dengan blur mask agar nyatu ke background.

| Background | Deskripsi |
|---|---|
| **REAL** | Kamera asli tanpa background virtual |
| **AINCRAD** | Kastil SAO melayang di langit malam berbintang |
| **ARCADE** | Ruangan arcade gelap dengan lampu neon |
| **SPACE** | Luar angkasa dengan nebula dan planet |
| **FOREST** | Hutan malam dengan kunang-kunang & bulan |
| **CITY** | Kota cyberpunk malam hari + hujan |
| **SUNSET** | Synthwave sunset dengan grid perspektif |
| **MATRIX** | Digital rain hijau ala film The Matrix |
| **DUNGEON** | Ruangan dungeon RPG dengan obor berkobar |

Semua background **animated** dan dirender dengan Canvas API — tidak butuh gambar eksternal.

### 🎨 Filters (8 pilihan)
Filter diapply langsung di canvas dengan adaptive **face highlight** otomatis — makin gelap filternya, makin terang highlight wajahnya biar muka tetap kebaca dan ekspresi tetap hidup.

| Filter | Keterangan | Face Highlight |
|---|---|---|
| Normal | Tanpa filter | 10% |
| B&W | Hitam putih + contrast | 18% |
| Sepia | Tone cokelat hangat | 14% |
| Vintage | Desaturated + warm | 14% |
| Cool | Hue shift biru | 14% |
| Warm | Hue shift oranye | 10% |
| Pixel | High contrast + saturate | 20% |
| Glitch | Psychedelic hue shift | 18% |

### 🖼️ Frames (6 pilihan)
Frame di-render langsung di canvas — selalu di atas semua layer (background + orang), tidak ada tabrakan di pinggiran.

- **None** — tanpa frame
- **Arcade** — border kuning + label ARCADE
- **Pixels** — pixel art border warna-warni
- **Stars** — bintang di sudut
- **Retro** — double border ungu
- **Neon** — border cyan glowing

### 📋 Photo Strip & Layout
- **Strip** — foto tersusun vertikal (klasik photobooth)
- **Grid** — foto tersusun grid (kolom otomatis)
- Nomor shot di tiap foto
- Header "PIXEL BOOTH" + footer nama & tanggal

### ⬇️ Download & QR Code
- **Download PNG** — simpan photo strip langsung ke perangkat
- **QR Code Download** — scan dari HP (HP & PC harus 1 WiFi, akses via IP lokal)

### 🔊 Sound Effects
Semua sound pakai **Web Audio API** — tidak butuh file audio eksternal:
- Countdown beep (beda nada tiap angka)
- Shutter click
- UI click
- Complete jingle
- Download sound

### 🎮 UI Game
- Pixel font (Press Start 2P)
- CRT scanlines overlay
- Animated pixel particles
- Score counter
- Custom crosshair cursor
- Efek flash saat foto

---

## 🗂️ Struktur Project

```
Photobooth-Web/
├── index.html                  # Halaman utama
├── README.md
└── assets/
    ├── css/
    │   └── style.css           # Styling & animasi
    └── js/
        ├── app.js              # Controller utama & alur screen
        ├── camera.js           # Webcam, countdown, MediaPipe compositing & face highlight
        ├── backgrounds.js      # 9 virtual background (Canvas API, semua animated)
        ├── filters.js          # 8 filter warna
        ├── frames.js           # 6 frame overlay (render di canvas)
        ├── strip.js            # Render photo strip
        ├── download.js         # Download PNG & QR code
        └── sounds.js           # Sound effects (Web Audio API)
```

---

## 🚀 Cara Menjalankan

### Prasyarat
- Browser modern (Chrome direkomendasikan)
- Izin kamera
- Koneksi internet (untuk load MediaPipe AI dari CDN)

### Opsi 1 — VS Code Live Server
```bash
git clone https://github.com/rakhadeto/Photobooth-Web.git
cd Photobooth-Web
# Klik kanan index.html → Open with Live Server
# Akses di localhost:5500
```

### Opsi 2 — XAMPP
```
Taruh folder di: C:\xampp\htdocs\Photobooth-Web\
Akses: localhost/Photobooth-Web
```

> ⚠️ Kamera butuh **HTTPS atau localhost**. Jangan buka via `file://`.

### Cara Pakai QR Download (HP scan dari PC)
1. Pastikan HP & PC **satu WiFi**
2. Buka CMD → ketik `ipconfig` → catat **IPv4 Address**
3. Akses Live Server via IP: `192.168.x.x:5500/Photobooth-Web/`
4. Di Chrome: buka `chrome://flags/#unsafely-treat-insecure-origin-as-secure` → tambahkan IP → Aktifkan → Luncurkan Ulang
5. Scan QR dari HP → auto download foto

---

## 🎮 Cara Pakai

1. **Setup** — masukkan nama, pilih jumlah foto & layout strip/grid
2. **Camera** — pilih virtual background, filter, frame & timer
3. **Shoot!** — countdown, senyum 📸
4. **Result** — download strip PNG atau scan QR dari HP

---

## 🛠️ Teknologi

![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

- **MediaPipe Selfie Segmentation** — AI virtual background real-time
- **Canvas API** — rendering, compositing, virtual BG, photo strip
- **Web Audio API** — sound effects tanpa file eksternal
- **MediaDevices API** — akses webcam
- **QRCode.js** — generate QR code

---

## 📄 Lisensi

MIT License — bebas digunakan dan dimodifikasi.

---

<p align="center">🕹️ Dibuat oleh <a href="https://github.com/rakhadeto">Naufal Rakhadeto</a> · 2026 🕹️</p>
