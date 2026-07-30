# Konfigurasi Undangan — Daftar Placeholder

Semua placeholder pakai format `{{ NAMA_PLACEHOLDER }}`. Cara paling cepat mengisi: pakai **Find & Replace** di editor (VS Code: `Ctrl+Shift+H` → centang "regex" tidak perlu, "match case" boleh ON).

Backend RSVP (Google Sheet + Apps Script) ada panduan terpisah di **`RSVP_SETUP.md`**.

---

## 1. Mempelai

| Placeholder | Contoh isi | File |
|---|---|---|
| `{{ NAMA_PRIA_LENGKAP }}` | `Budi Santoso, S.Kom` | `index.html`, `js/main.js`, `generator.py` |
| `{{ NAMA_PRIA_PANGGILAN }}` | `Budi` | `index.html` (cover, quote, closing), `js/main.js`, `generator.py` |
| `{{ IG_PRIA }}` | `budi.santoso` (tanpa @) | `index.html` |
| `{{ FOTO_PRIA }}` | `male1.jpg` (nama file di `img/`) | `index.html` |
| `{{ ANAK_KE_PRIA }}` | `pertama`, `kedua`, dst | `index.html` |
| `{{ AYAH_PRIA }}` | `Sutrisno` (tanpa "Bapak") | `index.html` |
| `{{ IBU_PRIA }}` | `Sumiyati` (tanpa "Ibu") | `index.html` |
| `{{ ALAMAT_PRIA }}` | `Jl. Mawar No. 12 RT 03/RW 05, …` | `index.html` |
| `{{ NAMA_WANITA_LENGKAP }}` | `Siti Aminah, S.Pd` | `index.html`, `js/main.js`, `generator.py` |
| `{{ NAMA_WANITA_PANGGILAN }}` | `Siti` | `index.html`, `js/main.js`, `generator.py` |
| `{{ IG_WANITA }}` | `siti.aminah` | `index.html` |
| `{{ FOTO_WANITA }}` | `female1.png` | `index.html` |
| `{{ ANAK_KE_WANITA }}` | `pertama`, `kedua`, dst | `index.html` |
| `{{ AYAH_WANITA }}` | `Hartono` | `index.html` |
| `{{ IBU_WANITA }}` | `Wahyuni` | `index.html` |
| `{{ ALAMAT_WANITA }}` | `Jl. Melati No. 7 …` | `index.html` |

> Ganti juga file `img/male1.jpg` & `img/female1.png` dengan foto mempelai baru. Kalau nama file beda, sesuaikan `{{ FOTO_PRIA }}` / `{{ FOTO_WANITA }}`.

---

## 2. Acara

| Placeholder | Contoh isi | File |
|---|---|---|
| `{{ TANGGAL_AKAD_TEXT }}` | `Sabtu, 15 Juni 2026` | `index.html` (meta + section acara) |
| `{{ TANGGAL_AKAD_PENDEK }}` | `15.06.2026` | `index.html` (quote section) |
| `{{ JAM_ACARA }}` | `Pukul 09:00 WIB - Selesai` | `index.html` |
| `{{ LOKASI_NAMA }}` | `Gedung Serbaguna XYZ` | `index.html`, `js/main.js` |
| `{{ LOKASI_ALAMAT }}` | `Jl. … Kab. …` | `index.html`, `js/main.js` |
| `{{ MAPS_URL }}` | `https://maps.app.goo.gl/xxxxx` | `index.html` |

### Tanggal untuk countdown & kalender (`js/main.js`)

| Placeholder | Format | Contoh untuk 15 Juni 2026, 09:00 WIB s.d. 14:00 WIB |
|---|---|---|
| `{{ TANGGAL_AKAD_JS }}` | `"Mmm DD, YYYY HH:MM:SS"` | `Jun 15, 2026 09:00:00` |
| `{{ EVENT_START_UTC }}` | `YYYYMMDDTHHMMSSZ` (UTC = WIB − 7 jam) | `20260615T020000Z` |
| `{{ EVENT_END_UTC }}` | sama | `20260615T070000Z` |
| `{{ EVENT_START_LOCAL }}` | `YYYYMMDDTHHMMSS` (jam lokal WIB) | `20260615T090000` |
| `{{ EVENT_END_LOCAL }}` | sama | `20260615T140000` |
| `{{ SLUG_PASANGAN }}` | huruf kecil, dash | `budi-siti` |

> Tip konversi UTC: kalau acara mulai jam 09:00 WIB, UTC-nya `09 − 7 = 02:00`. Akhir acara 14:00 WIB → `14 − 7 = 07:00` UTC.

---

## 3. Gift / Tanda Kasih

| Placeholder | Contoh isi | File |
|---|---|---|
| `{{ BANK_NAMA }}` | `Bank Mandiri` | `index.html` |
| `{{ BANK_NOREK }}` | `1234567890` | `index.html` |
| `{{ BANK_ATAS_NAMA }}` | `Budi Santoso` | `index.html` |
| `{{ BANK_LOGO_URL }}` | URL gambar logo bank (PNG/SVG) | `index.html` |
| `{{ EWALLET_NAMA }}` | `DANA` / `GoPay` / `OVO` | `index.html` |
| `{{ EWALLET_NOMOR }}` | `0812 3456 7890` | `index.html` |
| `{{ EWALLET_ATAS_NAMA }}` | `Siti Aminah` | `index.html` |
| `{{ EWALLET_LOGO_URL }}` | URL logo e-wallet | `index.html` |
| `{{ EWALLET_APP_URL }}` | mis. `https://link.dana.id/qr` | `index.html` |

---

## 4. Meta / OG / URL

| Placeholder | Contoh isi | File |
|---|---|---|
| `{{ JUDUL_UNDANGAN }}` | `The Wedding of Budi & Siti` | `index.html` (meta OG title) |
| `{{ JUDUL_TAB }}` | `BuSi \| Wedding` | `index.html` (tag `<title>`) |
| `{{ URL_UNDANGAN }}` | `https://budi-siti.netlify.app/` | `index.html` (meta OG url), |
| `{{ THUMBNAIL_URL }}` | URL gambar thumbnail (mis. `…/img/thumbnail2.png`) | `index.html` |
| `{{ HASHTAG_IG }}` | `BudiSitiWedding` | `index.html` |
| `{{ IG_HASHTAG_AKUN }}` | username IG yang dituju saat klik hashtag (boleh sama dgn `IG_PRIA`) | `index.html` |
| `{{ TAHUN }}` | `2026` | `index.html` (footer copyright) |

---

## 5. RSVP backend

| Placeholder | File |
|---|---|
| `{{ APPS_SCRIPT_URL }}` | `js/main.js` baris ~7 |

Setup: lihat **`RSVP_SETUP.md`**.

---

## 6. Audio

| Placeholder | Contoh isi | File |
|---|---|---|
| `{{ FILE_AUDIO }}` | `batassenja.mp3` (nama file di `audio/`) | `index.html` |

Ganti juga file di folder `audio/` kalau mau musik berbeda.

---

## 7. Generator WhatsApp (opsional)

| Placeholder | Contoh isi | File |
|---|---|---|
| `{{ BASE_INVITATION_URL }}` | `https://budi-siti.netlify.app/` (harus diakhiri `/`) | `generator.py` |

Cara pakai:
1. Buat file `tamu.txt` di folder yang sama dengan `generator.py`, isi 1 nama per baris.
2. Jalankan `python generator.py`.
3. Hasil link WhatsApp ada di `hasil.txt`.

---

## Checklist sebelum publish

- [ ] Semua `{{ ... }}` sudah diganti (cari di seluruh project: bila masih ada hasil, berarti ada yang terlewat)
- [ ] Foto mempelai di `img/` sudah diganti
- [ ] Logo bank & e-wallet sudah pasang URL yang benar
- [ ] `scriptURL` di `js/main.js` sudah URL Apps Script asli (test submit RSVP)
- [ ] Tanggal countdown & kalender sudah benar (jam UTC = jam WIB − 7)
- [ ] Meta OG image (`{{ THUMBNAIL_URL }}`) sudah upload & URL-nya valid (cek lewat <https://www.opengraph.xyz/>)
- [ ] Test buka link `<url-undangan>#NamaTamu` → nama tamu muncul di cover
