-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 13, 2025 at 11:58 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `agriflow`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int NOT NULL,
  `username` varchar(32) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_admin` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `username`, `email`, `password`, `created`, `is_admin`) VALUES
(1, 'bryandrsn', 'bryandrsn@gmail.com', '$2b$12$yEXUlLYqRNM8p86QeA.4seT1LYGu5C2KrpdLWhbimdSdJy026YEpG', '2025-06-06 11:16:30', 1),
(2, 'ransom', 'ransom@gmail.com', '$2b$12$e94/iOJ3z2U4Ik328m69iup3LIAiX/GjFn7SxoiAetqKwr6e1FtLe', '2025-06-06 11:18:27', 0),
(3, 'petani', 'petani@gmail.com', '$2b$12$q2WqCCSKgodGhpsILjmYQeXDh3cbJs1aMFd5zFXHcC.aijVMlhhgK', '2025-06-08 09:43:47', 0),
(4, 'nduu12', 'romod39258@agiuse.com', '$2b$12$.DJ9hONugnaRlA7Z9tT6CuooyToqGdaLBthtyQS2aUKMLW6uao56G', '2025-06-12 16:27:16', 1),
(5, 'nduuuu', 'nduu@gmail.com', '$2b$12$cs2CZE48g95Skjp3TkyCku4IvSF7nXxCHJBZG5A3sVW87byEWCfTy', '2025-06-13 05:29:34', 0);

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `benih_id` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `parent_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `account_id`, `benih_id`, `content`, `created_at`, `updated_at`, `parent_id`) VALUES
(27, 2, '1', 'Benih ini salah satu wishlist saya!!!', '2025-06-08 09:43:12', '2025-06-10 10:15:41', NULL),
(28, 3, '1', 'Saya juga!', '2025-06-08 09:44:20', '2025-06-08 09:44:20', 27),
(29, 3, '1', 'Benih yang sangat recommended', '2025-06-08 09:45:00', '2025-06-08 09:45:00', NULL),
(30, 2, '2', 'Mantap bosku benihnya!', '2025-06-09 09:53:30', '2025-06-09 09:53:30', NULL),
(41, 1, '1', 'Terima kasih!', '2025-06-12 12:53:54', '2025-06-12 12:53:54', 29),
(42, 5, '3', 'auto langganan mantap!!!!', '2025-06-13 06:32:06', '2025-06-13 06:32:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `data_benih`
--

CREATE TABLE `data_benih` (
  `id` int NOT NULL,
  `jenis_benih` varchar(16) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `varietas` varchar(64) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `umur` varchar(10) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `harga` decimal(10,2) DEFAULT NULL,
  `stok` int DEFAULT NULL,
  `deskripsi` text COLLATE utf8mb4_general_ci,
  `url_gambar` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `data_benih`
--

INSERT INTO `data_benih` (`id`, `jenis_benih`, `varietas`, `umur`, `harga`, `stok`, `deskripsi`, `url_gambar`, `created_at`, `updated_at`) VALUES
(1, 'Padi', 'Ciherang', '116-125', '10000.00', 40, 'Memliliki bentuk gabah panjang ramping. Tahan terhadap wereng coklat biotipe 2 dan 3. Tahan terhadap hawar daun bakteri patotipe III dan IV. Baik diatanam pada musim penghujan dan kemarau dengan ketinggian dibawah 500mdpl', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749546187/wjpyd5cvs8fikb6x8j0h.png', '2025-05-17 10:25:24', '2025-06-13 06:04:28'),
(2, 'Padi', 'INPARI 32 HDB', '120', '10000.00', 9, 'Memiliki bentuk gabah medium. Agak rentan terhadap wereng batang cokelat biotipe 1,2, dan 3. Memiliki ketahanan penyakit terhadap hawar daun bakteri patotipe III, agak tahan patotipe IV dan VIII. Tahan blas ras 033, agak tahan ras 073, rentan terhadap blas ras 133 dan 173 serta agak tahan tungro ras Lanrang. : Cocok ditanam di ekosistem sawah dataran rendah sampai ketinggian 600 mdpl.', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749547949/x53yygxvd41yldzclupf.png', '2025-05-17 10:34:24', '2025-06-13 06:05:01'),
(3, 'Padi', 'Logawa', '115', '10000.00', 100, 'Memliliki bentuk gabah ramping dan berwarna kuning. Memiliki ketahanan terhadap wereng coklat biotipe 2. Tahan terhadap penyakit hawar daun bakteri strain III. Direkomendasikan ditanam untuk lahan sawah dataran rendah kurang dari 500mdpl', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749548157/iyrs5e8vqzdv9kvfyfpc.jpg', '2025-05-17 10:47:05', '2025-06-10 09:35:59'),
(4, 'Padi', 'INPARI 42 AGRITAN GSR', '112', '10000.00', 100, 'Memiliki bentuk gabah ramping dan berwarna kuning jerami. TAgak tahan terhadap wereng batang coklat biotipe 1, dan agak rentan terhadap biotipe 2 dan 3. Agak tahan terhadap hawar daun bakteri patotipe III, rentan strain IV, dan agak rentan strain VIII, tahan terhadap penyakit blas daun ras 073, agak tahan terhadap ras 033 dan rentan terhadap ras 133 dan 173. Direkomendasikan untuk ditanam di lahan sawah dengan ketinggian 0-600 mdpl', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749548276/xh3i2cpdq5laqlcfjlpo.png', '2025-05-17 11:04:58', '2025-06-10 09:37:57'),
(5, 'Padi', 'MEKONGGA', '116-125', '10000.00', 0, 'Memiliki bentuk gabah ramping panjang dan berwarna kuning bersih. Varietas ini agak rentan terhadap hama wereng batang coklat biotipe 2 dan 3. Varietas Mekongga ini agak tahan terhadap penyakit hawar daun bakteri patotipe IV. Direkomendasikan untuk ditanam di sawah dataran rendah sampai ketinggian 500mdpl.', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749548440/pganu2vgww97i3e7971w.png', '2025-05-17 11:18:22', '2025-06-10 09:40:42'),
(6, 'Padi', 'SINTANUR', '115-125', '10000.00', 100, 'Memiliki bentuk gabah sedang dan berwarna kuning bersih. Tahan terhadap hama wereng coklat biotipe 1 dan 2 dan rentan terhadap wereng coklat biotipe 3. Memiliki ketahanan terhadap hawar daun bakteri strain III dan rentan terhadap strain IV dan VIII. Direkomendasikan untuk ditanam di lahan sawah irigasi dataran rendah sampai 550mdpl.', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749548509/coolueln0ei1rvhjprek.png', '2025-05-17 11:48:22', '2025-06-10 09:41:50'),
(7, 'Padi', 'INPARI 48 BLAS', '121', '10000.00', 100, 'Memiliki bentuk gabah ramping dan berwarna kuning jerami. Varietas ini agak tahan terhadap hama WBC biotipe 1, 2, dan 3, serta agak rentan WBC populasi lapang Sukamandi. INPARI 48 BLAS juga agak tahan terhadap penyakit HDB patotipe III, IV, dan rentan terhadap patotipe VIII. Tahan terhadap blas ras 033, agak tahan ras 073, 133, dan 173. Rentan terhadap penyakit tungro inokulum Garut dan Purwakarta. Direkomendasikan untuk ditanam pada lahan sawah irigasi pada ketinggian 0-600 mdpl.', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749548609/chywc6p71g5rzmfgasmu.png', '2025-05-17 11:55:47', '2025-06-10 09:43:31'),
(8, 'Padi', 'INPARI 49 JEMBAR', '112', '10000.00', 100, 'Memiliki bentuk gabah medium dan berwarna kuning jerami. Varietas ini agak tahan terhadap hama wereng batang cokelat biotipe 1, 2, dan biotipe 3. Agak tahan terhadap penyakit hawar daun bakteri patotipe III, sangat rentan terhadap patotipe IV dan rentan terhadap patotipe VIII. Agak tahan terhadap penyakit blas ras 073, rentan terhadap blas ras 033, 133 dan 173. Rentan terhadap tungro inokulum Garut dan Purwakarta. Direkomendasikan untuk Baik ditanam pada lahan sawah irigasi pada ketinggian 0-600mdpl dengan mengikuti kaidah budidaya padi lahan sawah irigasi melalui pengelolaan tanaman terpadu (PTT).', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749548757/cedef9upujfqofommmel.png', '2025-05-17 12:03:34', '2025-06-10 09:45:59'),
(9, 'Padi', 'INPARI 18', '102', '10000.00', 100, 'Memiliki bentuk gabah panjang ramping dan berwarna kuning.Varietas ini agak tahan terhadap hama wereng batang coklat biotipe 1 dan 2, rentan terhadap wereng batang coklat biotipe 3. INPARI 18 ini juga tahan terhadap penyakit hawar daun bakteri patotipe III, IV, dan VIII. Varietas ini cocok untuk ditanam di lahan irigasi dan tadah hujan dengan ketinggian 0 -600mdpl.', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749548844/acfhwe5f8yru9yu3ufkh.png', '2025-05-17 12:09:20', '2025-06-10 09:47:25'),
(10, 'Padi', 'CAKRABUANA AGRITAN', '104', '10000.00', 100, 'Memiliki bentuk gabah panjang ramping dan berwarna kuning bersih. Varietas ini agak tahan terhadap hama wereng batang coklat biotipe 1, 2, dan 3. Agak tahan terhadap penyakit HDB strain III, rentan hawar daun bakteri strain IV dan VIII. Tahan penyakit blas ras 033, dan 173. Agak tahan penyakit tungro inoculum Purwakarta. Varietas ini cocok untuk ditanam pada lahan sawah irigasi dataran rendah dan menengah sampai ketinggian 600 mdpl.', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749548898/aq6rrbnsgme0cpmhbryw.png', '2025-05-17 12:13:11', '2025-06-10 09:48:19'),
(20, 'Jagung', 'Jagung Manis JM 313', '68-78', '15000.00', 100, 'Jagung manis varietas JM 313 memiliki penampang batang yang berbentuk bulat. Jagung varietas ini memiliki batang yang berwarna Hijau Kuning kemudian untuk daunnya berbentuk bangun pita dan berwarna Hijau Gelap. Varietas ini biasanya memasuki fase berbunga pada umur 50-57 hari setelah tanam. Adapun keunggulan varietas jagung manis JM 313 ini daripada varietas lain yaitu berupa diameter tongkol yang besar, berat tongkol per tanaman relatif lebih tinggi, dan produktivitas yang tinggi. Varietas ini biasanya paling cocok untuk ditanam di dataran rendah. ', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749812932/tir6jj2tzhgt12qfcexu.jpg', '2025-06-13 06:57:08', '2025-06-13 11:08:53'),
(21, 'Jagung', 'Jagung Manis RHJ 04', '75-76', '15000.00', 48, 'Jagung manis varietas RHJ 04 memiliki penampang batang yang berbentuk bulat dengan warna batang Hijau Muda. Daunnya berbentuk bangun pita dan memiliki warna Hijau Segar. Varietas ini biasanya mulai memasuki fase berbunga pada umur sekitar 55–60 hari setelah tanam. Keunggulan utama dari varietas jagung manis RHJ 04 dibandingkan dengan varietas lainnya adalah bentuk tongkol yang silindris dan padat, ukuran tongkol yang besar, serta memiliki jumlah baris biji yang teratur dan seragam. Selain itu, varietas ini dikenal memiliki rasa yang manis serta tekstur biji yang renyah. Varietas RHJ 04 paling cocok ditanam di dataran rendah hingga menengah dengan kondisi tanah yang subur dan pengairan yang cukup.', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749812962/ly86nors43ze0oejx9tq.jpg', '2025-06-13 07:03:34', '2025-06-13 11:09:23'),
(22, 'Jagung', 'Jagung Manis RHJ 05', '67-69', '15000.00', 15, 'Jagung manis varietas RHJ 05 memiliki penampang batang berbentuk bulat dengan warna batang Hijau Kekuningan. Daun dari varietas ini berbentuk bangun pita dan berwarna Hijau Tua yang mencerminkan pertumbuhan vegetatif yang baik. RHJ 05 biasanya mulai memasuki fase berbunga pada kisaran umur 58–63 hari setelah tanam. Keunggulan varietas ini dibandingkan dengan varietas lain terletak pada ukuran tongkol yang besar, barisan biji yang rapi dan penuh, serta rasa biji yang manis dan renyah. Selain itu, berat tongkol per tanaman cenderung tinggi sehingga mendukung produktivitas total yang optimal. Varietas ini sangat cocok ditanam di dataran rendah dengan iklim tropis basah dan sistem pengairan yang cukup.', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749813009/uu4ufvei1nafqef3mqs4.jpg', '2025-06-13 07:06:22', '2025-06-13 11:10:10'),
(23, 'Jagung', 'Jagung Manis Hibrix 81', '71-73', '14999.00', 100, 'Jagung manis varietas Hibrix 81 memiliki penampang batang yang berbentuk bulat. Jagung varietas ini memiliki batang yang berwarna Hijau, dan daunnya berbentuk bangun pita serta berwarna. Varietas ini biasanya memasuki fase berbunga pada umur 53–55 hari setelah tanam. Adapun keunggulan varietas jagung manis Hibrix 81 ini dibandingkan varietas lain yaitu memiliki bentuk tongkol silindris yang besar, barisan biji yang lurus dan rapat, serta rasa biji yang manis dengan kadar gula tinggi. Tongkolnya memiliki panjang antara 18,99–19,63 cm dengan diameter 5,02–5,17 cm. Berat tongkol per tanaman berkisar antara 370,37–383,96 gram, dengan produktivitas tinggi yang mencapai 16,52–17,36 ton per hektar. Varietas ini paling cocok untuk ditanam di dataran rendah, dengan rata-rata hasil mencapai 17,01 ton/ha dan kadar gula rata-rata 13,52 °Brix, menjadikannya salah satu varietas unggul untuk budidaya jagung manis konsumsi.', 'http://res.cloudinary.com/dfmfsrwxn/image/upload/v1749813049/jk2hrgjmml2xjc8uwxhz.jpg', '2025-06-13 07:43:36', '2025-06-13 11:10:51');

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `benih_id` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`id`, `user_id`, `benih_id`, `created_at`) VALUES
(20, 2, 1, '2025-06-09 10:09:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `data_benih`
--
ALTER TABLE `data_benih`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_wishlist_item` (`user_id`,`benih_id`),
  ADD KEY `product_id` (`benih_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `data_benih`
--
ALTER TABLE `data_benih`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`benih_id`) REFERENCES `data_benih` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
