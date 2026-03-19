# 🕹️ PIXEL BOOTH — Retro Arcade Photobooth

> Web-based photobooth dengan tema **Retro Arcade / Game** — dibangun dengan HTML, CSS, dan JavaScript murni tanpa framework. Ambil foto, pilih filter & frame, dan download hasilnya sebagai photo strip!

🔗 **Live Demo:** *(coming soon)*

---

## ✨ Fitur

- **🎮 UI Ala Game** — Pixel font, CRT scanlines, efek glowing neon
- **📷 Live Camera Preview** — Akses webcam langsung dari browser
- **⏱ Countdown Timer** — Pilih 3, 5, atau 10 detik sebelum foto
- **🎨 8 Filter Warna** — Normal, B&W, Sepia, Vintage, Cool, Warm, Pixel, Glitch
- **🖼 6 Frame Overlay** — None, Arcade, Pixels, Stars, Retro, Neon
- **🔢 Jumlah Foto Bebas** — User tentukan sendiri (1–10 foto)
- **📋 Layout Strip / Grid** — Pilih susunan hasil foto
- **⬇ Download PNG** — Simpan photo strip langsung ke perangkat
- **📱 QR Code Download** — Scan QR untuk download dari HP
- **🔊 Sound Effects** — Countdown beep, shutter click, jingle (Web Audio API)
- **👤 Nama Player** — Nama tampil di footer strip

---

## 🗂️ Struktur Project

```
Photobooth-Web/
├── index.html                  # Halaman utama
├── README.md
└── assets/
    ├── css/
    │   └── style.css           # Semua styling & animasi
    └── js/
        ├── app.js              # Controller utama & alur screen
        ├── camera.js           # Akses webcam & capture foto
        ├── filters.js          # Filter warna (CSS + Canvas)
        ├── frames.js           # Frame overlay (HTML + Canvas)
        ├── strip.js            # Render photo strip di canvas
        ├── download.js         # Download PNG & generate QR
        └── sounds.js           # Sound effects (Web Audio API)
```

---

## 🚀 Cara Menjalankan

### Opsi 1 — Langsung buka di browser (paling gampang)
```bash
# Clone repo
git clone https://github.com/rakhadeto/Photobooth-Web.git
cd Photobooth-Web

# Buka index.html di browser
# (Double click index.html)
```
> ⚠️ Webcam butuh **HTTPS atau localhost**. Kalau buka langsung (`file://`), kamera mungkin tidak bisa akses. Gunakan live server.

### Opsi 2 — Pakai VS Code Live Server
1. Install ekstensi **Live Server** di VS Code
2. Klik kanan `index.html` → **Open with Live Server**
3. Browser otomatis buka di `localhost:5500`

### Opsi 3 — Pakai XAMPP
1. Taruh folder di `C:\xampp\htdocs\Photobooth-Web\`
2. Jalankan Apache di XAMPP
3. Buka `localhost/Photobooth-Web`

---

## 🎮 Cara Pakai

1. **Setup** — Masukkan nama, pilih jumlah foto & layout
2. **Camera** — Pilih filter & frame, tekan SHOOT!
3. **Countdown** — Hitung mundur, senyum! 📸
4. **Result** — Download strip atau scan QR code

---

## 🛠️ Teknologi

![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

- **Web Audio API** — sound effects tanpa file eksternal
- **Canvas API** — rendering photo strip
- **MediaDevices API** — akses webcam
- **QRCode.js** — generate QR code

---

## 📄 Lisensi

MIT License — bebas digunakan dan dimodifikasi.

---

<p align="center">🕹️ Dibuat oleh <a href="https://github.com/rakhadeto">Naufal Rakhadeto</a> · 2026 🕹️</p>
