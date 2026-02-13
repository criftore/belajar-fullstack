// Ambil elemen tombol pertama (Portofolio)
const tombolPorto = document.querySelector('.links a');

// Berikan aksi saat tombol diklik
tombolPorto.addEventListener('click', function(event) {
    // Mencegah link berpindah halaman untuk sementara
    event.preventDefault(); 
    
    // Tampilkan pesan sapaan
    alert('Halo! Selamat datang di Portofolio Criftore. Proyek ini sedang dikembangkan!');
    
    // Ubah warna background kartu secara acak sebagai bonus
    document.querySelector('.card').style.borderColor = '#00ff88';
    document.querySelector('.card').style.borderStyle = 'solid';
    document.querySelector('.card').style.borderWidth = '2px';
});
