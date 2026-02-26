//Impor library & Konfigurasi Awal
require("dotenv").config();
const express = require("express");
const path = require("path");
const session = require("express-session");
const { initDatabase } = require("./config/database");
const catatanRoutes = require("./routes/catatan");

const app = express();
const port = 3000;

//Pengaturan Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  }),
);

//Middleware Log & Login Status
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  console.log(`[${new Date().toLocaleString()}] ${req.method} ke ${req.url}`);
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  next();
});

//Public Routes Login
app.get("/login", (req, res) => {
  if (req.session.isLoggedIn) {
    return res.redirect("/catatan/baca");
  }
  res.render("login", { pesan: "" });
});

app.post("/login", (req, res) => {
  const passwordBenar = process.env.APP_PASSWORD;
  const inputPassword = req.body.password;

  if (inputPassword === passwordBenar) {
    req.session.isLoggedIn = true;
    console.log("Login Berhasil!");
    res.redirect("/catatan/baca");
  } else {
    console.log("Login Gagal!");
    res.render("login", { pesan: "Password Salah!" });
  }
});

//Logout & Proteksi
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

//Protect Routes
const authMiddleware = (req, res, next) => {
  if (req.session.isLoggedIn) return next();
  res.redirect("/login");
};
app.use("/catatan", authMiddleware, catatanRoutes);
app.get("/", (req, res) => res.redirect("/catatan/baca"));

//Inisialisasi Database
initDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server aktif di http://localhost:${port}`);
  });
});
