const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

const pathFile = path.join(__dirname, "database_lokal", "catatan.json");

app.get("/", (req, res) => {
  res.send(
    "<h1>Halo! ini server express Pertama Saya</h1><p>Selamat Datang di H3.</p>",
  );
});

app.get("/tambah", (req, res) => {
  res.send(`
 <h1>Tambah Catatan Baru</h1>
 <form action="/simpan" method="POST">
 <textarea name="catatan_baru" rows="4" cols="59" placeholder="Ketik catatanmu di sini..."></textarea><br>
 <button type="submit">Simpan Catatan</button>
 </form>
 <br><a href="/baca-catatan">Lihat Semua Catatan</a>
 `);
});

app.post("/simpan", (req, res) => {
  const isiBaru = req.body.catatan_baru;

  fs.readFile(pathFile, "utf-8", (err, data) => {
    let listCatatan = [];
    if (!err && data) {
      listCatatan = JSON.parse(data);
    }
    const objekBaru = {
      id: Date.now(),
      waktu: new Date().toLocaleString(),
      isi: isiBaru,
    };
    listCatatan.push(objekBaru);

    fs.writeFile(pathFile, JSON.stringify(listCatatan, null, 2), (err) => {
      if (err) return res.send("Gagal menyimpan!");
      res.send('<h1>Berhasil!</h1><a href="/baca-catatan">Lihat Hasilnya</a>');
    });
  });
});

app.get("/baca-catatan", (req, res) => {
  fs.readFile(pathFile, "utf-8", (err, data) => {
    if (err || !data) return res.send("Belum ada catatan");
    const listCatatan = JSON.parse(data);
    let tampilan = `
    <style>
    body {
    font-family:sans-serif; background-color:#f4f4f9; padding: 20px;
    }
    .container {
    max-width:600px; margin: auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    .card {
    border-left: 5px solid #007bff; background: #f9f9f9; padding: 15px; margin-bottom: 15px; position:relative; border-radius: 10px;
    }
    .btn-hapus {
    color: #ff4d4d; text-decoration:none; font-size: 0.8em; font-weight: bold; border: 1px solid #ff4d4d; padding: 3px 8px; border-radius: 5px;
    }
    .btn-hapus:hover {
    background: #ff4d4d; color:white;
    }
    .btn-tambah {
    display: inline-block; background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;
    }
    .btn-edit {
    color: #007bff; text-decoration: none; font-size: 0.8em; margin-right: 10px;
    }

    .waktu {
    color: #666;
    }
    .isi-item {
    font-size: 1.1em; margin: 10px 0;
    }
    </style>
    <div class="container">
      <h1> Catatan Saya</h1>
      <form action="/cari" method="GET">
      <input type="text" name="keyword" placeholder="Cari catatan...">
      <button type="submit">Cari</button>
      </form>
    `;

    listCatatan.forEach((item) => {
      tampilan += `
      <div class="card">
      <small class="waktu">${item.waktu}</small>
      <p class="isi-item">${item.isi}</p>
      <a href="/edit/${item.id}" class="btn-edit">Edit</a>
      <a href="/hapus/${item.id}" class="btn-hapus" onclick="return confirm('Yakin mau hapus?')">Hapus Catatan</a>
      </div>
      `;
    });

    tampilan += `
    <a href="/tambah" class="btn-tambah">+ Tambah Catatan baru</a>
    </div>
    `;
    res.send(tampilan);
  });
});

app.get("/edit/:id", (req, res) => {
  const idCari = req.params.id;

  fs.readFile(pathFile, "utf-8", (err, data) => {
    if (err) return res.send("Gagal membaca data!");
    const listCatatan = JSON.parse(data);

    const catatanDitemukan = listCatatan.find(
      (item) => item.id.toString() === idCari,
    );
    if (!catatanDitemukan) return res.send("Catatan tidak ditemukan!");

    res.send(`
      <h1>Edit Catatan</h1>
      <form action="/update/${catatanDitemukan.id}" method="POST">
        <textarea name="isi_baru" rows"4" cols="50">${catatanDitemukan.isi}</textarea><br><br>
        <button type="submit">Simpan Perubahan</button>
        </form>
        <br><a href="/baca-catatan">Batal</a>
      `);
  });
});

app.post("/update/:id", (req, res) => {
  const idUpdate = req.params.id;
  const isiTerbaru = req.body.isi_baru;

  fs.readFile(pathFile, "utf-8", (err, data) => {
    if (err) return res.send("Gagal membaca data!");
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
      if (err) return res.send("Gagal Memperbaharui!");
      res.redirect("/baca-catatan");
    });
  });
});

app.get("/hapus/:idCatatan", (req, res) => {
  const idYangMauDihapus = req.params.idCatatan;

  fs.readFile(pathFile, "utf-8", (err, data) => {
    if (err) return res.send("Gagal membaca database!");
    const listCatatan = JSON.parse(data);
    const dataBaru = listCatatan.filter(
      (item) => item.id.toString() !== idYangMauDihapus,
    );
    fs.writeFile(pathFile, JSON.stringify(dataBaru, null, 2), (err) => {
      if (err) return res.send("Gagal menghapus!");
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

    let tampilan = `
    <style>
    body {
    font-family: sans-serif; background-color: #f4f4f9; padding:20px}
    .container {
    max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px:
    }
    .card {
    border-left: 5px solid #28a745; background: #f9f9f9: padding: 15px; margin-bottom: 15px; border-radius: 10px;
    }
    .waktu {color: #666; font-size: 0.8em;}
    </style>

    <div class="container">
    <h1>Hasil Pencarian untuk: "${kataKunci}"</h1>
    <p>Ditemukan ${hasilFilter.length} catatan.</p>
    <hr>
    `;
    if (hasilFilter.length === 0) {
      tampilan += "<p>Tidak ditemukan catatan yang cocok.</p>";
    } else {
      hasilFilter.forEach((item) => {
        tampilan += `
        <div class="card">
        <small class="waktu">${item.waktu}</small>
        <p>${item.isi}</p>
        </div>
        `;
      });
    }
    tampilan += `<br><a href="/baca-catatan" style="text-decoration:none; color:#007bff;"><=Kembali ke Semua Catatan</a>
    </div>
    `;
    res.send(tampilan);
  });
});

app.get("/profil", (req, res) => {
  res.send(
    "<h1>Profil Saya</h1><p>Nama saya Muhammad Taufik Fadillah, sedang belajar Backend!</p>",
  );
});

app.listen(port, () => {
  console.log(`Server sudah jalan di http://localhost:${port}`);
});
