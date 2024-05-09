-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 09, 2024 at 11:24 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `legacy_marker`
--

-- --------------------------------------------------------

--
-- Table structure for table `legacy_users`
--

CREATE TABLE `legacy_users` (
  `user_id` int(11) NOT NULL,
  `email` varchar(191) NOT NULL,
  `f_name` varchar(191) NOT NULL,
  `l_name` varchar(191) NOT NULL,
  `u_name` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `s_address` varchar(191) NOT NULL,
  `apartment` varchar(191) NOT NULL,
  `state` varchar(191) NOT NULL,
  `city` varchar(191) NOT NULL,
  `zip_code` varchar(191) NOT NULL,
  `phone_number` varchar(191) NOT NULL,
  `alt_email` varchar(191) NOT NULL,
  `profile_photo_url` varchar(191) NOT NULL,
  `cover_photo_url` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `legacy_users`
--

INSERT INTO `legacy_users` (`user_id`, `email`, `f_name`, `l_name`, `u_name`, `password`, `s_address`, `apartment`, `state`, `city`, `zip_code`, `phone_number`, `alt_email`, `profile_photo_url`, `cover_photo_url`) VALUES
(1, 'info@digioussolutions.com', 'Digious', 'Solutions', 'moizk1481', 'admin1234', '', '', '', '', '', '', '', 'uploads\\profiles\\profilePhoto-1715187259460.jpg', 'uploads\\cover\\coverPhoto-1715187266099.jpg'),
(2, 'devolution@gmail.com', 'Waleed ', 'Qureshi', 'Qureshi321', 'devolution123', '', '', '', '', '', '02132620292', 'info@digioussolutions.com', 'uploads\\profiles\\profilePhoto-1715280231603.jpg', 'uploads\\cover\\coverPhoto-1715280239443.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `lm_marker`
--

CREATE TABLE `lm_marker` (
  `m_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `m_name` varchar(191) DEFAULT NULL,
  `m_profile` varchar(191) DEFAULT NULL,
  `m_dob` datetime(3) DEFAULT NULL,
  `m_dod` datetime(3) DEFAULT NULL,
  `about_m` varchar(191) DEFAULT NULL,
  `rel_profile` varchar(191) DEFAULT NULL,
  `rel_name` varchar(191) DEFAULT NULL,
  `relationship` varchar(191) DEFAULT NULL,
  `rel_link` varchar(191) DEFAULT NULL,
  `place_city` varchar(191) DEFAULT NULL,
  `place_state` varchar(191) DEFAULT NULL,
  `start_place` datetime(3) DEFAULT NULL,
  `end_place` datetime(3) DEFAULT NULL,
  `inst_name` varchar(191) DEFAULT NULL,
  `start_edu` datetime(3) DEFAULT NULL,
  `end_edu` datetime(3) DEFAULT NULL,
  `eulogy` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `lm_marker`
--

INSERT INTO `lm_marker` (`m_id`, `user_id`, `m_name`, `m_profile`, `m_dob`, `m_dod`, `about_m`, `rel_profile`, `rel_name`, `relationship`, `rel_link`, `place_city`, `place_state`, `start_place`, `end_place`, `inst_name`, `start_edu`, `end_edu`, `eulogy`, `createdAt`) VALUES
(40, 1, 'Hammad Qureshi', 'uploads\\markers\\markerprofile-1715286240849.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-05-09 20:24:00.860'),
(41, 1, 'Hamza Khan', 'uploads\\markers\\markerprofile-1715286259970.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-05-09 20:24:20.026'),
(42, 1, 'Arlik Khan', 'uploads\\markers\\markerprofile-1715287335201.jpg', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2024-05-09 20:42:15.217');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('1edd6851-241e-45b4-9488-f8ac281d2a79', '748a1eda2d1639bb7f2b89f69a8e602b3b9b9e1dcccc505bbecb4533e2b63ef0', '2024-05-08 17:18:16.876', '20240428212009_primsmigrate', NULL, NULL, '2024-05-08 17:18:16.852', 1),
('98e7c4e1-97b1-49cb-bc7d-d9b2b10825a7', 'e76a31e9e2abe8acaf3aeebd886e2efb20a2ac6a2f768cacb6b780ca5f627d07', '2024-05-08 17:18:17.297', '20240508171817_mynewmig', NULL, NULL, '2024-05-08 17:18:17.265', 1),
('f7bf15f5-b221-4264-8722-522dff79c72a', '66b85d5445ce5c9c8d16c0d41848eac1c45446e06076e72f144c279d47dd88f3', '2024-05-08 20:41:52.990', '20240508204152_mynewmigtab', NULL, NULL, '2024-05-08 20:41:52.943', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `legacy_users`
--
ALTER TABLE `legacy_users`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `lm_marker`
--
ALTER TABLE `lm_marker`
  ADD PRIMARY KEY (`m_id`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `legacy_users`
--
ALTER TABLE `legacy_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `lm_marker`
--
ALTER TABLE `lm_marker`
  MODIFY `m_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
