var product = ["Laptop", "Smartphone", "Tablet", "Headphones", "Smartwatch"];

document.write("<h3>Daftar Produk:</h3>");
document.write("<ol>");
product.forEach((data) => {
  document.write(`<li>${data}</li>`);
});
document.write("</ol>");

var buah = ["Apel", "Jeruk", "Pisang", "Mangga", "Strawberry"];

buah[5] = "Anggur";
buah.push("Kiwi");
document.write(buah);

const angka = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

const filteredArray = angka.filter((item) => item % 20 === 0);
document.write("<br>Angka yang habis dibagi 20: " + filteredArray);

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
