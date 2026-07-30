# Panduan Setup RSVP Backend (Google Sheet + Apps Script)

Undangan ini menyimpan RSVP & ucapan tamu di **Google Sheet** lewat **Google Apps Script** (sebagai Web App). Karena project ini dipakai untuk pengantin baru, Anda harus membuat **Sheet + Apps Script baru** supaya datanya tidak campur dengan pengantin sebelumnya.

Estimasi waktu: ~10 menit.

---

## 1. Buat Google Sheet baru

1. Buka <https://sheets.google.com> → **Blank**.
2. Beri nama, mis. `RSVP – [Nama Mempelai]`.
3. Di **baris pertama** (header), isi persis seperti ini:

   | A | B | C | D | E |
   |---|---|---|---|---|
   | Timestamp | Nama | Konfirmasi | Jumlah | Ucapan |

   > Urutan & nama kolom **harus persis** seperti di atas (case-sensitive). Apps Script di bawah mengandalkan header ini.

---

## 2. Buka Apps Script editor

Di sheet yang sama: **Extensions → Apps Script**. Hapus semua kode default-nya, lalu paste kode di bawah:

```javascript
// ===== KONFIGURASI =====
// Ganti dengan password yang Anda mau pakai untuk verifikasi hapus ucapan.
// (Disarankan: simpan di Script Properties, lihat catatan di bawah.)
const ADMIN_PASSWORD_FALLBACK = "ganti-password-ini";

function getAdminPassword() {
  // Cara aman: simpan password di Project Settings → Script Properties (key: ADMIN_PASSWORD).
  // Kalau tidak ada, fallback ke konstanta di atas.
  const fromProps = PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");
  return fromProps || ADMIN_PASSWORD_FALLBACK;
}

function getSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

// ===== HANDLER: GET = baca semua ucapan =====
function doGet(e) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  const headers = data.shift(); // buang baris header

  const rows = data
    .map((row, idx) => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      obj.rowNumber = idx + 2; // +2: karena header dibuang dan row 1-based
      return obj;
    })
    .filter(r => r.Nama); // skip baris kosong

  return ContentService
    .createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}

// ===== HANDLER: POST =====
// - tanpa "action"           → append RSVP baru
// - action=delete            → hapus baris (butuh password)
function doPost(e) {
  const params = e.parameter || {};
  const action = params.action;

  try {
    if (action === "delete") {
      return handleDelete(params);
    }
    return handleAppend(params);
  } catch (err) {
    return jsonResponse({ result: "error", message: String(err) });
  }
}

function handleAppend(p) {
  const sheet = getSheet();
  const timestamp = new Date();
  // Urutan harus cocok dengan header: Timestamp | Nama | Konfirmasi | Jumlah | Ucapan
  sheet.appendRow([
    timestamp,
    p.Nama || "",
    p.Konfirmasi || "",
    p.Jumlah || "",
    p.Ucapan || ""
  ]);
  const lastRow = sheet.getLastRow();
  return jsonResponse({ result: "success", row: lastRow });
}

function handleDelete(p) {
  const password = p.password || "";
  if (password !== getAdminPassword()) {
    return jsonResponse({ result: "error", message: "Password salah." });
  }
  const row = parseInt(p.row, 10);
  if (!row || row < 2) {
    return jsonResponse({ result: "error", message: "Nomor baris tidak valid." });
  }
  const sheet = getSheet();
  if (row > sheet.getLastRow()) {
    return jsonResponse({ result: "error", message: "Baris tidak ditemukan." });
  }
  sheet.deleteRow(row);
  return jsonResponse({ result: "success" });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

Klik **Save** (ikon disket), beri nama project mis. `RSVP API`.

---

## 3. (Opsional tapi disarankan) Simpan password di Script Properties

Daripada hardcode password di kode, simpan di Script Properties:

1. Di Apps Script editor: **⚙ Project Settings** (ikon gerigi di sidebar kiri).
2. Scroll ke **Script Properties** → **Add script property**.
3. Property: `ADMIN_PASSWORD`, Value: `<password-rahasia-anda>`. Save.

Setelah ini, kode akan otomatis pakai password ini, bukan `ADMIN_PASSWORD_FALLBACK`.

---

## 4. Deploy sebagai Web App

1. Klik tombol **Deploy → New deployment** (pojok kanan atas).
2. Klik ikon gerigi di "Select type" → pilih **Web app**.
3. Isi:
   - **Description**: `RSVP API v1` (bebas)
   - **Execute as**: `Me (akun anda)`
   - **Who has access**: **Anyone**  ← WAJIB. Kalau dipilih "Anyone with Google account", fetch dari browser tamu akan gagal.
4. Klik **Deploy**.
5. Google akan minta authorize → ikuti prompt (Continue → pilih akun → Advanced → Go to … → Allow).
6. Copy **Web app URL** yang muncul. Bentuknya:

   ```
   https://script.google.com/macros/s/AKfycb..................../exec
   ```

---

## 5. Pasang URL ke project

Buka `js/main.js`, cari baris ini di bagian atas:

```js
const scriptURL = "{{ APPS_SCRIPT_URL }}";
```

Ganti placeholder `{{ APPS_SCRIPT_URL }}` dengan URL yang Anda copy di langkah 4. Hasil akhir:

```js
const scriptURL = "https://script.google.com/macros/s/AKfycb..../exec";
```

Save & reload halaman undangan. Selesai.

---

## 6. Tes

1. Buka `index.html` (atau hosting tujuan) di browser.
2. Klik **Open Invitation** → scroll ke **Buku Tamu & RSVP** → klik **Isi Buku Tamu & RSVP**.
3. Isi form, submit. Ucapan harus langsung muncul di wish-wall.
4. Buka Google Sheet → baris baru harus muncul.
5. Reload halaman → ucapan tetap muncul (dimuat dari sheet).
6. Hover ucapan → tombol × muncul → klik → konfirm → masukkan password yang Anda set di langkah 3.

---

## Troubleshooting

| Gejala | Kemungkinan penyebab |
|---|---|
| Wish wall kosong, console error CORS / "Failed to fetch" | URL Apps Script salah / belum di-deploy / akses bukan "Anyone" |
| Submit form jalan tapi tidak masuk sheet | Header kolom di sheet tidak sama persis (Timestamp, Nama, Konfirmasi, Jumlah, Ucapan) |
| `{result: "error", message: "Password salah."}` saat hapus | Password yang Anda input tidak match dengan `ADMIN_PASSWORD` di Script Properties (atau `ADMIN_PASSWORD_FALLBACK` di kode) |
| Setelah update kode Apps Script, perubahan tidak terasa | Apps Script Web App perlu **redeploy**: **Deploy → Manage deployments → ✎ (edit) → Version: New version → Deploy**. URL TIDAK berubah. |

---

## Catatan tambahan

- Karena URL `/exec` di Apps Script bersifat tetap selama Anda hanya edit deployment yang sama, **jangan klik "New deployment" untuk tiap perubahan**—itu menghasilkan URL baru tiap kali. Pakai **Manage deployments → edit** seperti di tabel troubleshooting.
- Apps Script gratisan ada quota harian (tapi cukup besar untuk pemakaian undangan: ribuan request/hari). Aman untuk satu acara pernikahan.
- Privasi: data RSVP cuma bisa dilihat oleh pemilik akun Google yang punya sheet itu. Tamu yang fetch hanya bisa baca, tidak bisa lihat sheet langsung.
