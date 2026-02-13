const areaTeks = document.getElementById("areateks");
const hitung = document.getElementById("counter");
areaTeks.addEventListener("keyup", function () {
  hitung.innerText = this.value.length;
});

const judul = document.createElement("h1");
judul.innerText = "Dokumen ini ditulis dengan kode JS Eksternal";
document.body.appendChild(judul);

var nama = "Petani Kode";
var visitorCount = 50322;
var isActive = true;
var url = "https://www.petanikode.com";

function parBaru(teks) {
  const baru = document.createElement("p");
  baru.innerText = teks;
  document.body.appendChild(baru);
}

parBaru("Nama Situs: " + nama);
parBaru("Jumlah Pengunjung: " + visitorCount);
parBaru("Status Aktif: " + isActive);
parBaru("Alamat URL: " + url);

let warnaLatar = document.getElementById("warnaLatar");
warnaLatar.addEventListener("change", (event) => {
  document.body.style.backgroundColor = warnaLatar.value;
});
let warnaTeks = document.getElementById("warnaTeks");
warnaTeks.addEventListener("change", (event) => {
  document.body.style.color = warnaTeks.value;
});

function warnaAcak() {
  const hex = "0123456789ABCDEF";
  let warna = "#";
  for (let i = 0; i < 6; i++) {
    warna += hex[Math.floor(Math.random() * 16)];
  }
  return warna;
}

let paragraf = document.getElementsByClassName("paragraf");

for (let p of paragraf) {
  p.addEventListener("mouseenter", function (event) {
    if (!event.target.dataset.original) {
      event.target.dataset.original = event.target.innerText;
    }
    event.target.innerText = "Kamu memasuki area paragraf!";
  });
  p.addEventListener("mouseout", function (event) {
    event.target.innerText = "Kamu keluar dari area paragraf!";
    event.target.style.fontWeight = "normal";
    const targetElement = event.target;
    setTimeout(() => {
      targetElement.innerText = targetElement.dataset.original;
    }, 1000);
  });

  p.addEventListener("mouseover", function (event) {
    event.target.style.fontWeight = "bold";
  });
}
setInterval(function () {
  paragraf[0].style.color = warnaAcak();
  paragraf[1].style.color = warnaAcak();
  paragraf[2].style.color = warnaAcak();
  setTimeout(function () {
    paragraf[0].style.color = warnaAcak();
    paragraf[1].style.color = warnaAcak();
    paragraf[2].style.color = warnaAcak();
  }, 500);
}, 1000);

function holla() {
  alert("Hello dari file eksternal!");
}

const tombolHellow = document.getElementById("hellow");
tombolHellow.addEventListener("click", function () {
  alert("Hello dari file eksternal!");
});

const dblKlik = document.getElementById("dbl");
dblKlik.addEventListener("dblclick", function () {
  alert("Kamu melakukan double click!");
});
