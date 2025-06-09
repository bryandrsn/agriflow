-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 17 Bulan Mei 2025 pada 14.33
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `data_benih`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `data_benih`
--

CREATE TABLE `data_benih` (
  `id_benih` int(11) NOT NULL,
  `jenis_benih` varchar(16) DEFAULT NULL,
  `varietas` varchar(64) DEFAULT NULL,
  `umur` varchar(10) DEFAULT NULL,
  `harga` decimal(10,2) DEFAULT NULL,
  `stok` int(11) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `url_gambar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `data_benih`
--

INSERT INTO `data_benih` (`id_benih`, `jenis_benih`, `varietas`, `umur`, `harga`, `stok`, `deskripsi`, `url_gambar`, `created_at`, `updated_at`) VALUES
(1, 'Padi', 'Ciherang', '116-125', NULL, 100, 'Memliliki bentuk gabah panjang ramping. Tahan terhadap wereng coklat biotipe 2 dan 3. Tahan terhadap hawar daun bakteri patotipe III dan IV. Baik diatanam pada musim penghujan dan kemarau dengan ketinggian dibawah 500mdpl', NULL, '2025-05-17 10:25:24', '2025-05-17 10:25:24'),
(2, 'Padi', 'Inpari 32 HDB', '120', NULL, 100, 'Memiliki bentuk gabah medium. Agak rentan terhadap wereng batang cokelat biotipe 1,2, dan 3. Memiliki ketahanan penyakit terhadap hawar daun bakteri patotipe III, agak tahan patotipe IV dan VIII. Tahan blas ras 033, agak tahan ras 073, rentan terhadap blas ras 133 dan 173 serta agak tahan tungro ras Lanrang. : Cocok ditanam diekosistem sawah dataran rendah sampai ketinggian 600 mdpl.', NULL, '2025-05-17 10:34:24', '2025-05-17 10:34:24'),
(3, 'Padi', 'Logawa', '115', NULL, 100, 'Memliliki bentuk gabah ramping dan berwarna kuning. Memiliki ketahanan terhadap wereng coklat biotipe 2. Tahan terhadap penyakit hawar daun bakteri strain III. Direkomendasikan ditanam untuk lahan sawah dataran rendah kurang dari 500mdpl', NULL, '2025-05-17 10:47:05', '2025-05-17 10:47:05'),
(4, 'Padi', 'INPARI 42 AGRITAN GSR', '112', NULL, 100, 'Memiliki bentuk gabah ramping dan berwarna kuning jerami. TAgak tahan terhadap wereng batang coklat biotipe 1, dan agak rentan terhadap biotipe 2 dan 3. Agak tahan terhadap hawar daun bakteri patotipe III, rentan strain IV, dan agak rentan strain VIII, tahan terhadap penyakit blas daun ras 073, agak tahan terhadap ras 033 dan rentan terhadap ras 133 dan 173. Direkomendasikan untuk ditanam di lahan sawah dengan ketinggian 0-600 mdpl', NULL, '2025-05-17 11:04:58', '2025-05-17 11:04:58'),
(5, 'Padi', 'MEKONGGA', '116-125', NULL, 100, 'Memiliki bentuk gabah ramping panjang dan berwarna kuning bersih. Varietas ini agak rentan terhadap hama wereng batang coklat biotipe 2 dan 3. Varietas Mekongga ini agak tahan terhadap penyakit hawar daun bakteri patotipe IV. Direkomendasikan untuk ditanam di sawah dataran rendah sampai ketinggian 500mdpl.', NULL, '2025-05-17 11:18:22', '2025-05-17 11:18:22'),
(6, 'Padi', 'SINTANUR', '115-125', NULL, 100, 'Memiliki bentuk gabah sedang dan berwarna kuning bersih. Tahan terhadap hama wereng coklat biotipe 1 dan 2 dan rentan terhadap wereng coklat biotipe 3. Memiliki ketahanan terhadap hawar daun bakteri strain III dan rentan terhadap strain IV dan VIII. Direkomendasikan untuk ditanam di lahan sawah irigasi dataran rendah sampai 550mdpl.', NULL, '2025-05-17 11:48:22', '2025-05-17 11:48:22'),
(7, 'Padi', 'INPARI 48 BLAS', '121', NULL, 100, 'Memiliki bentuk gabah ramping dan berwarna kuning jerami. Varietas ini agak tahan terhadap hama WBC biotipe 1, 2, dan 3, serta agak rentan WBC populasi lapang Sukamandi. INPARI 48 BLAS juga agak tahan terhadap penyakit HDB patotipe III, IV, dan rentan terhadap patotipe VIII. Tahan terhadap blas ras 033, agak tahan ras 073, 133, dan 173. Rentan terhadap penyakit tungro inokulum Garut dan Purwakarta. Direkomendasikan untuk ditanam pada lahan sawah irigasi pada ketinggian 0-600 mdpl.', NULL, '2025-05-17 11:55:47', '2025-05-17 11:55:47'),
(8, 'Padi', 'INPARI 49 JEMBAR', '112', NULL, 100, 'Memiliki bentuk gabah medium dan berwarna kuning jerami. Varietas ini agak tahan terhadap hama wereng batang cokelat biotipe 1, 2, dan biotipe 3. Agak tahan terhadap penyakit hawar daun bakteri patotipe III, sangat rentan terhadap patotipe IV dan rentan terhadap patotipe VIII. Agak tahan terhadap penyakit blas ras 073, rentan terhadap blas ras 033, 133 dan 173. Rentan terhadap tungro inokulum Garut dan Purwakarta. Direkomendasikan untuk Baik ditanam pada lahan sawah irigasi pada ketinggian 0-600mdpl dengan mengikuti kaidah budidaya padi lahan sawah irigasi melalui pengelolaan tanaman terpadu (PTT).', NULL, '2025-05-17 12:03:34', '2025-05-17 12:03:34'),
(9, 'Padi', 'INPARI 18', '102', NULL, 100, 'Memiliki bentuk gabah panjang ramping dan berwarna kuning.Varietas ini agak tahan terhadap hama wereng batang coklat biotipe 1 dan 2, rentan terhadap wereng batang coklat biotipe 3. INPARI 18 ini juga tahan terhadap penyakit hawar daun bakteri patotipe III, IV, dan VIII. Varietas ini cocok untuk ditanam di lahan irigasi dan tadah hujan dengan ketinggian 0 -600mdpl.', NULL, '2025-05-17 12:09:20', '2025-05-17 12:09:20'),
(10, 'Padi', 'CAKRABUANA AGRITAN', '104', NULL, 100, 'Memiliki bentuk gabah panjang ramping dan berwarna kuning bersih. Varietas ini agak tahan terhadap hama wereng batang coklat biotipe 1, 2, dan 3. Agak tahan terhadap penyakit HDB strain III, rentan hawar daun bakteri strain IV dan VIII. Tahan penyakit blas ras 033, dan 173. Agak tahan penyakit tungro inoculum Purwakarta. Varietas ini cocok untuk ditanam pada lahan sawah irigasi dataran rendah dan menengah sampai ketinggian 600 mdpl.', NULL, '2025-05-17 12:13:11', '2025-05-17 12:13:11');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `data_benih`
--
ALTER TABLE `data_benih`
  ADD PRIMARY KEY (`id_benih`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `data_benih`
--
ALTER TABLE `data_benih`
  MODIFY `id_benih` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
