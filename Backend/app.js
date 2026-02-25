require("dotenv").config();

const express = require("express");
const initSqlJs = require("sql.js"); // Perbaikan: pakai kutip dan huruf kecil
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;
const dbPath = path.join(__dirname, "catatan.db");
const session = require("express-session");

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  console.log(`[${new Date().toLocaleString()}] ${req.method} ke ${req.url}`);
  next();
});

let db;

// Inisialisasi Database (Pasti jalan tanpa NDK)
initSqlJs().then(function (SQL) {
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
    console.log("Berhasil memuat database lama.");
  } else {
    db = new SQL.Database();
    db.run(`CREATE TABLE IF NOT EXISTS tugas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            waktu TEXT,
            isi TEXT
        )`);
    saveData();
    console.log("Database baru dibuat.");
  }
  console.log(`Server aktif di http://localhost:${port}`);
});

// Fungsi untuk menyimpan data ke file fisik
function saveData() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// --- ROUTES ---

app.get("/login", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/baca-catatan");
  }
  res.render("login", { pesan: "" });
});
app.post("/login", (req, res) => {
  const passwordBenar = process.env.APP_PASSWORD;
  const inputPassword = req.body.password;

  if (inputPassword === passwordBenar) {
    req.session.isLoggedIn = true;
    console.log("Login Berhasil!");
    res.redirect("/baca-catatan");
  } else {
    console.log("Login Gagal!");
    res.render("login", { pesan: "Password Salah!" });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.get("/", (req, res) => res.redirect("/baca-catatan"));

app.use((req, res, next) => {
  if (req.url === "/login" || req.session.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});

app.get("/baca-catatan", (req, res) => {
  try {
    const result = db.exec("SELECT * FROM tugas ORDER BY id DESC");
    // sql.js mengembalikan data dalam format array of objects
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

app.get("/tambah", (req, res) => res.render("tambah"));

app.post("/simpan", (req, res) => {
  const isiBaru = req.body.catatan_baru;
  const waktuSekarang = new Date().toLocaleString();

  if (!isiBaru || isiBaru.trim() === "") return res.send("Catatan kosong!");

  try {
    db.run("INSERT INTO tugas (waktu, isi) VALUES (?, ?)", [
      waktuSekarang,
      isiBaru,
    ]);
    saveData();
    res.redirect("/baca-catatan");
  } catch (err) {
    res.send(err.message);
  }
});

app.get("/edit/:id", (req, res) => {
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

app.post("/update/:id", (req, res) => {
  const waktuUpdate = new Date().toLocaleString() + " (Edited)";
  try {
    db.run("UPDATE tugas SET isi = ?, waktu = ? WHERE id = ?", [
      req.body.isi_baru,
      waktuUpdate,
      req.params.id,
    ]);
    saveData();
    res.redirect("/baca-catatan");
  } catch (err) {
    res.send(err.message);
  }
});

app.get("/hapus/:id", (req, res) => {
  try {
    db.run("DELETE FROM tugas WHERE id = ?", [req.params.id]);
    saveData();
    res.redirect("/baca-catatan");
  } catch (err) {
    res.send(err.message);
  }
});

app.get("/cari", (req, res) => {
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

app.get("/profil", (req, res) => res.render("profil"));

app.listen(port);
