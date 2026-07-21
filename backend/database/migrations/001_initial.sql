-- ============================================================
-- Migration 001: Initial schema
-- Created: 2026-07-22
-- Description: Creates all existing tables for chess.loc
-- Source: phpMyAdmin SHOW CREATE TABLE (db_chess)
-- ============================================================

-- ------------------------------------------------------------
-- Table: chess_users
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chess_users` (
  `user_id` int(11) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password_hash` varchar(255) DEFAULT NULL,
  `user_fullname` varchar(100) DEFAULT NULL,
  `user_avatar` varchar(100) DEFAULT NULL,
  `user_rating` int(11) DEFAULT 1000,
  `user_telegram` varchar(50) DEFAULT NULL,
  `user_chesscom` varchar(50) DEFAULT NULL,
  `user_lichess` varchar(50) DEFAULT NULL,
  `user_role` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `chess_users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_name` (`user_name`);

ALTER TABLE `chess_users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT;

-- ------------------------------------------------------------
-- Table: chess_news
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `chess_news` (
  `news_id` smallint(5) UNSIGNED NOT NULL,
  `news_title` tinytext NOT NULL,
  `news_descr` text NOT NULL,
  `news_status` tinyint(1) NOT NULL DEFAULT 0,
  `news_date` date DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `chess_news`
  ADD PRIMARY KEY (`news_id`);

ALTER TABLE `chess_news`
  MODIFY `news_id` smallint(5) UNSIGNED NOT NULL AUTO_INCREMENT;
