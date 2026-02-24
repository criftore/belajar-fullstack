const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const db = new sqlite3.Database("./catatan.db", (err) => {
  if (err) console.error(err.message);
  console.log("Terhubung ke database SQLite.");
});

db.run(`CREATE TABLE IF NOT EXISTS tugas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  waktu TEXT,
  isi TEXT
  )`);

app.get("/", (req, res) => {
  res.redirect("/baca-catatan");
});

app.get("/tambah", (req, res) => {
  res.render("tambah");
});

app.post("/simpan", (req, res) => {
  const isiBaru = req.body.catatan_baru;
  const waktuSekarang = new Date().toLocaleString();

  if (!isiBaru || isiBaru.trim() === "") {
    return res.send(
      "<script>alert('Catatan tidak boleh kosong!'); window.history.back();</script>",
    );
  }

  db.run(
    `INSERT INTO tugas (waktu, isi) VALUES (?, ?)`,
    [waktuSekarang, isiBaru],
    (err) => {
      if (err) return res.send(err.message);
      res.redirect("/baca-catatan");
    },
  );
});

app.get("/baca-catatan", (req, res) => {
  db.all("SELECT * FROM tugas ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.send(err.message);
    res.render("index", { dataCatatan: rows });
  });
});

app.get("/edit/:id", (req, res) => {
  const idCari = req.params.id;

  db.get("SELECT * FROM tugas WHERE id = ?", [idCari], (err, row) => {
    if (err) return res.send(err.message);
    if (!row) return res.send("Catatan tidak ditemukan!");
    res.render("edit", { catatanDitemukan: row });
  });
});

app.post("/update/:id", (req, res) => {
  const idUpdate = req.params.id;
  const isiTerbaru = req.body.isi_baru;
  const waktuUpdate = new Date().toLocaleString() + " (Edited)";

  db.run(
    `UPDATE tugas SET isi = ?, waktu = ? WHERE id = ?`,
    [isiTerbaru, waktuUpdate, idUpdate],
    (err) => {
      if (err) return res.send(err.message);
      res.redirect("/baca-catatan");
    },
  );
});

app.get("/hapus/:id", (req, res) => {
  const idYangMauDihapus = req.params.id;
  db.run(`DELETE FROM tugas WHERE id = ?`, [idYangMauDihapus], (err) => {
    if (err) return res.send(err.message);
    res.redirect("/baca-catatan");
  });
});

app.get("/cari", (req, res) => {
  const kataKunci = `%${req.query.keyword || ""}%`;
  db.all("SELECT * FROM tugas WHERE isi LIKE ?", [kataKunci], (err, rows) => {
    if (err) return res.send(err.message);
    res.render("cari", {
      hasil: rows,
      keyword: req.query.keyword,
    });
  });
});

app.get("/profil", (req, res) => {
  res.render("profil");
});

app.listen(port, () => {
  console.log(`Server sudah jalan di http://localhost:${port}`);
});
