const express = require("express");
const router = express.Router();
const { getDb, saveDatabase } = require("../config/database");

router.get("/baca", (req, res) => {
  const db = getDb();
  try {
    const result = db.exec("SELECT * FROM tugas ORDER BY id DESC");
    const rows =
      result.length > 0
        ? result[0].values.map((row) => ({
            id: row[0],
            waktu: row[1],
            isi: row[2],
          }))
        : [];
    res.render("index", { dataCatatan: rows });
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/tambah", (req, res) => {
  res.render("tambah");
});

router.post("/simpan", (req, res) => {
  const db = getDb();
  const isiBaru = req.body.catatan_baru;
  const waktuSekarang = new Date().toLocaleString();

  if (!isiBaru || isiBaru.trim() === "") {
    return res.send(`<script>
                        alert("Ups!Catatan tidak boleh kosong.");
                        window.location.href ="/catatan/tambah";</script>
                        `);
  }
  try {
    db.run("INSERT INTO tugas (waktu, isi) VALUES (?,?)", [
      waktuSekarang,
      isiBaru,
    ]);
    saveDatabase();
    res.redirect("/catatan/baca");
  } catch (err) {
    res.send(err.message);
  }
});

// Tambahkan rute edit, update, hapus, dan cari di sini dengan pola yang sama...
// Gunakan res.redirect("/catatan/baca") setelah proses selesai.

router.get("/edit/:id", (req, res) => {
  const db = getDb();
  try {
    const result = db.exec("SELECT * FROM tugas WHERE id = ?", [req.params.id]);
    if (result.length === 0) return res.send("Data tidak ada");

    const row = result[0].values[0];
    const catatanDitemukan = { id: row[0], waktu: row[1], isi: row[2] };
    res.render("edit", { catatanDitemukan });
  } catch (err) {
    res.send(err.message);
  }
});

router.post("/update/:id", (req, res) => {
  const db = getDb();
  const waktuUpdate = new Date().toLocaleString() + " (Edited)";
  try {
    db.run("UPDATE tugas SET isi = ?, waktu = ? WHERE id = ?", [
      req.body.isi_baru,
      waktuUpdate,
      req.params.id,
    ]);
    saveDatabase();
    res.redirect("/catatan/baca");
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/hapus/:id", (req, res) => {
  const db = getDb();
  try {
    db.run("DELETE FROM tugas WHERE id = ?", [req.params.id]);
    saveDatabase();
    res.redirect("/catatan/baca");
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/cari", (req, res) => {
  const db = getDb();
  const kataKunci = req.query.keyword || "";
  const sqlKeyword = `%${kataKunci}%`;
  try {
    const result = db.exec(
      "SELECT * FROM tugas WHERE LOWER (isi) LIKE LOWER (?)",
      [sqlKeyword],
    );
    const rows =
      result.length > 0
        ? result[0].values.map((row) => ({
            id: row[0],
            waktu: row[1],
            isi: row[2],
          }))
        : [];
    res.render("cari", { hasil: rows, keyword: kataKunci });
  } catch (err) {
    res.send(err.message);
  }
});

router.get("/profil", (req, res) => {
  res.render("profil");
});

module.exports = router;
