SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Table structure for table `users`

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `membership_type` enum('Basic','Premium') DEFAULT NULL,
  `last_renewed` date DEFAULT NULL,
  `referral_code` varchar(10) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;


-- Sample Data

INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `username`, `password`, `membership_type`, `last_renewed`, `referral_code`, `created_at`) VALUES
(2, 'John', 'Doe', 'john.doe@example.com', 'john', '5f4dcc3b5aa765d61d8327deb882cf99', 'Basic', '2024-10-16', 'REF1234', '2024-11-24 18:45:53'),
(3, 'Jane', 'Smith', 'jane.smith@example.com', 'jane', '5f4dcc3b5aa765d61d8327deb882cf99', 'Premium', '2024-11-25', 'REF5678', '2024-11-24 18:45:53'),
(19, 'user', '1', 'user@gmail.com', 'user1', '$2y$10$frjuKdTm7rP2swrEXUm4..C35z4XMdEtex8d.8TVjrQX26a1tF2wC', 'Basic', '2024-10-07', 'D170BE5F', '2024-11-26 06:43:43'),
(17, 'Eman', 'Brown', 'final@test.com', 'Eman19', '$2y$10$1Czg29LviZ/WM38NHOEsRON7R6BTFSgVt6p/Dkc/aLlvhh7HL.BZG', 'Basic', '2024-11-26', '4134D1A7', '2024-11-26 03:58:22'),
(5, 'Admin', 'User', 'admin@user.com', 'admin', '$2y$10$68sLaHCQLi9CqYFaLXh85eNOAavPlQFgkOg6FXlsLVgi1DZuVzNia', 'Basic', '2024-11-25', '1CB8D4A2', '2024-11-25 10:57:24'),
(6, 'Jonathan', 'Williams', 'bp10@gmail.com', 'bp', '$2y$10$MmSMUzI0iBTBi7tFGI5nzuQzUL4unhLiv/seiCKpeRZ4/LtAlxVkm', 'Premium', '2024-11-24', '4722F58C', '2024-11-25 13:30:48'),
(15, 'Test', 'token', 'token@gmail.com', 'token', '$2y$10$4QOWK80g8VG1TfuGea.mGembqHRYfP6f.JMaecT9k22D/saJeJ846', 'Basic', '2024-10-15', '8847C0FF', '2024-11-26 03:52:14'),
(14, 'Abigail', 'Smith', 'asmith9.info@gmail.com', 'AbigailS4', '$2y$10$F0rzQphGrhZZ94vXv5JiGOnc8UmfJ8HbtgdzjYdzRCfowE.PMBa8q', 'Premium', '2024-11-25', '722C3EC6', '2024-11-25 20:38:25');
COMMIT;
