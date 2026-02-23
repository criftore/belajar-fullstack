const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const pathFile = path.join(__dirname, "database_lokal", "catatan.json");

const folderPath = path.join(__dirname, "database_lokal");
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}
if (!fs.existsSync(pathFile)) {
  fs.writeFileSync(pathFile, JSON.stringify([], null, 2));
}

app.get("/", (req, res) => {
  res.redirect("/baca-catatan");
});

app.get("/tambah", (req, res) => {
  res.render("tambah");
});

app.post("/simpan", (req, res) => {
  const isiBaru = req.body.catatan_baru;

  fs.readFile(pathFile, "utf-8", (err, data) => {
    let listCatatan = JSON.parse(data || "[]");
    listCatatan.push({
      id: Date.now(),
      waktu: new Date().toLocaleString(),
      isi: isiBaru,
    });
    fs.writeFile(pathFile, JSON.stringify(listCatatan, null, 2), (err) => {
      res.redirect("/baca-catatan");
    });
  });
});

app.get("/baca-catatan", (req, res) => {
  fs.readFile(pathFile, "utf-8", (err, data) => {
    const listCatatan = JSON.parse(data || "[]");

    res.render("index", { dataCatatan: listCatatan });
  });
});

app.get("/edit/:id", (req, res) => {
  const idCari = req.params.id;

  fs.readFile(pathFile, "utf-8", (err, data) => {
    const listCatatan = JSON.parse(data || "[]");
    const ditemukan = listCatatan.find((item) => item.id.toString() === idCari);

    if (!ditemukan) return res.send("Catatan tidak ditemukan!");

    res.render("edit", { catatanDitemukan: ditemukan });
  });
});

app.post("/update/:id", (req, res) => {
  const idUpdate = req.params.id;
  const isiTerbaru = req.body.isi_baru;

  fs.readFile(pathFile, "utf-8", (err, data) => {
    let listCatatan = JSON.parse(data);
    listCatatan = listCatatan.map((item) => {
      if (item.id.toString() === idUpdate) {
        return {
          ...item,
          isi: isiTerbaru,
          waktu: new Date().toLocaleString() + " (Edited)",
        };
      }
      return item;
    });

    fs.writeFile(pathFile, JSON.stringify(listCatatan, null, 2), (err) => {
      res.redirect("/baca-catatan");
    });
  });
});

app.get("/hapus/:idCatatan", (req, res) => {
  const idYangMauDihapus = req.params.idCatatan;

  fs.readFile(pathFile, "utf-8", (err, data) => {
    const listCatatan = JSON.parse(data || "[]");
    const dataBaru = listCatatan.filter(
      (item) => item.id.toString() !== idYangMauDihapus,
    );
    fs.writeFile(pathFile, JSON.stringify(dataBaru, null, 2), (err) => {
      res.redirect("/baca-catatan");
    });
  });
});

app.get("/cari", (req, res) => {
  const kataKunci = (req.query.keyword || "").toLowerCase();

  fs.readFile(pathFile, "utf-8", (err, data) => {
    if (err || !data) return res.send("Database kosong!");

    const listCatatan = JSON.parse(data);
    const hasilFilter = listCatatan.filter((item) =>
      item.isi.toLowerCase().includes(kataKunci),
    );

    res.render("cari", {
      hasil: hasilFilter,
      keyword: kataKunci,
    });
  });
});

app.get("/profil", (req, res) => {
  res.render("profil");
});

app.listen(port, () => {
  console.log(`Server sudah jalan di http://localhost:${port}`);
});
