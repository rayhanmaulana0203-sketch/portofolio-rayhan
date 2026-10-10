# Portfolio

Portofolio statis ini memakai server Node.js bawaan dan tidak memerlukan dependency npm untuk berjalan.

## Persyaratan

Gunakan Node.js 18.11 atau yang lebih baru.

## Menjalankan server lokal

```sh
npm start
```

Kemudian buka `http://127.0.0.1:3000`. Selama pengembangan, server dapat dijalankan dengan restart otomatis:

```sh
npm run dev
```

Alamat bind dan port dapat diatur melalui variabel lingkungan `HOST` dan `PORT`.

## Pemeriksaan dan build

Pemeriksaan lokal memvalidasi ID halaman, tautan antar-section, dan aset lokal:

```sh
npm run check
```

Build menyalin HTML, JavaScript, CSS, dan gambar ke folder `dist` setelah pemeriksaan lulus:

```sh
npm run build
```

Folder `dist` adalah hasil build dan tidak perlu diedit langsung. Konfigurasi Netlify menggunakan perintah build tersebut.

Di VS Code, buka **Terminal → Run Task** untuk menjalankan task Check, Build, atau Start server.

## Endpoint status

`GET /api/health` mengembalikan status JSON server, misalnya:

```json
{
  "status": "ok",
  "service": "rayhan-portfolio",
  "timestamp": "2026-10-09T00:00:00.000Z"
}
```
