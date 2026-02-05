console.log("File JS sudah tersambung!");

function notifPopup(pesan, durasi = 1500) {
  let pop = document.getElementById("notifCustom");
  let msg = document.getElementById("pesanNotif");
  msg.innerText = pesan;

  pop.classList.add("show");
  setTimeout(() => {
    pop.classList.remove("show");
  }, durasi);
}

function fade() {
  document.body.classList.add("fade-out");
}

function Index() {
  fade();
  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
}

function prosesLogin() {
  let nama = document.getElementById("username").value;
  if (nama === "") {
    notifPopup("Isi dulu usernamenya Bosku!");
    return false;
  } else {
    localStorage.setItem("user_aktif", nama);
    notifPopup("Halo " + nama + " Menghubungkan...");
    fade();
    setTimeout(() => {
      window.location.href = "home.html";
    }, 1000);
    return false;
  }
}
function salam() {
  let namaUser = localStorage.getItem("user_aktif");
  let elementSalam = document.getElementById("Salam");
  if (elementSalam) {
    if (namaUser) {
      elementSalam.innerText = "Halo, " + namaUser + "!";
    } else {
      notifPopup("Akses ditolak!!! Silahkan login dulu Bosku!");
      Index();
    }
  }
}
function prosesLogout() {
  localStorage.removeItem("user_aktif");
  notifPopup("Terima Kasih telah berkunjung Bosku!");
  Index();
}
salam();
