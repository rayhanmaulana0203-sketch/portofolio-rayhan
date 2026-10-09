# Portfolio

Portofolio statis ini dapat dijalankan melalui server Node.js bawaan, tanpa dependency tambahan.

## Menjalankan

Gunakan Node.js 18.11 atau yang lebih baru:

```sh
npm start
```

Kemudian buka `http://127.0.0.1:3000`. Untuk pengembangan dengan restart otomatis:

```sh
npm run dev
```

Port dan alamat bind dapat diatur melalui variabel lingkungan `PORT` dan `HOST`.

## Endpoint status

`GET /api/health` mengembalikan status JSON server, misalnya:

```json
{
  "status": "ok",
  "service": "rayhan-portfolio",
  "timestamp": "2026-10-09T00:00:00.000Z"
}
```
