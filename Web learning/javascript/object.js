var car = {
  type: "Fiat",
  model: "500",
  color: "aqua",

  start: function () {
    console.log("Mobil dinyalakan");
  },
  drive: function () {
    console.log("Mobil berjalan");
  },
  brake: function () {
    console.log("Mobil dihentikan");
  },
  stop: function () {
    console.log("Mobil dimatikan");
  },
};

let hasil = document.getElementById("hasil");
let loadContent = document.getElementById("loadContent");
let clearContent = document.getElementById("clear");

loadContent.addEventListener("click", () => {
  var xhr = new XMLHttpRequest();
  var url = "https://api.github.com/users/petanikode";

  xhr.onloadstart = () => {
    loadContent.innerHTML = "Loading...";
  };
  xhr.onerror = () => {
    alert("Terjadi kesalahan saat memuat data.");
  };

  xhr.onloadend = () => {
    if (xhr.responseText !== "") {
      var data = JSON.parse(xhr.responseText);
      var img = document.createElement("img");
      img.src = data.avatar_url;
      var name = document.createElement("h3");
      name.innerHTML = data.name;

      hasil.append(img, name);
      loadContent.innerHTML = "Done";

      setTimeout(function () {
        loadContent.innerHTML = "Load Lagi";
      }, 1500);
    }
  };

  xhr.open("GET", url, true);
  xhr.send();
});

clearContent.addEventListener("click", () => {
  hasil.innerHTML = "";
  loadContent.innerHTML = "Muat Konten";
});
