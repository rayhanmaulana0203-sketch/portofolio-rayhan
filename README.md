# Portofolio Muhamad Rayhan Maulana

Website portofolio yang dibangun menggunakan framework **Astro** dengan pendekatan arsitektur komponen modular, performa statis cepat, dan standar desain anti-slop yang bersih.

## Persyaratan
- Node.js 18.11 atau yang lebih baru

## Pengembangan Lokal
Untuk menjalankan server pengembangan lokal dengan live-reload:

```sh
npm run dev
```

Buka browser di `http://localhost:4321`.

## Build Produksi
Untuk melakukan build statis dan validasi otomatis:

```sh
npm run build
```

Hasil build akan otomatis dibuat di folder `dist/` dan diverifikasi integritasnya melalui `node tools/check-site.mjs`.

## Preview Hasil Build
Untuk meninjau hasil build lokal:

```sh
npm run preview
```

## Struktur Proyek
- `src/`
  - `components/` - Komponen modular: Header, Hero, About, Education, Skills, Projects, Contact, Footer
  - `layouts/` - Layout utama (Layout.astro)
  - `pages/` - Halaman rute Astro (index.astro)
  - `styles/` - Stylesheet utama (style.css)
  - `scripts/` - Skrip interaktivitas (main.js)
- `public/` - Aset statis (gambar, font, favicon)
- `dist/` - Direktori keluaran build untuk Netlify
- `astro.config.mjs` - Konfigurasi Astro
- `netlify.toml` - Konfigurasi build & deploy Netlify
