const sqlite3 = require("sqlite3").verbose();

// Membuka database (akan otomatis membuat file catatan.db jika belum ada)
const db = new sqlite3.Database("./catatan.db", (err) => {
  if (err) return console.error("Gagal koneksi:", err.message);
  console.log("✅ Berhasil terhubung ke SQLite!");
});

// Membuat tabel 'catatan' untuk menyimpan data kita
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS tugas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        isi TEXT NOT NULL,
        tanggal TEXT
    )`,
    (err) => {
      if (err) console.error("Gagal buat tabel:", err.message);
      else console.log("✅ Tabel 'tugas' siap digunakan!");
    },
  );
});

db.close();
