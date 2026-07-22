-- ============================================================
-- Migration 002: Roles & Permissions System
-- Created: 2026-07-22
-- Description: Adds RBAC tables. user_role column is kept
--              for backward compatibility during transition.
-- ============================================================

-- ------------------------------------------------------------
-- Table: roles
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: permissions
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `permissions` (
  `permission_id` int(11) NOT NULL AUTO_INCREMENT,
  `permission_key` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`permission_id`),
  UNIQUE KEY `permission_key` (`permission_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: role_permissions (связь role ↔ permission)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `role_permissions` (
  `role_id` int(11) NOT NULL,
  `permission_id` int(11) NOT NULL,
  PRIMARY KEY (`role_id`, `permission_id`),
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE CASCADE,
  FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`permission_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- Table: user_roles (связь user ↔ role)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_roles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `assigned_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`, `role_id`),
  FOREIGN KEY (`user_id`) REFERENCES `chess_users`(`user_id`) ON DELETE CASCADE,
  FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Seed: начальные роли
-- ============================================================
INSERT INTO `roles` (`role_name`, `description`) VALUES
  ('ADMIN',     'Полный доступ ко всем функциям'),
  ('MODERATOR', 'Управление контентом и пользователями'),
  ('USER',      'Базовые права пользователя');

-- ============================================================
-- Seed: начальные permissions
-- ============================================================
INSERT INTO `permissions` (`permission_key`, `description`) VALUES
  ('admin.access',        'Доступ к админ-панели'),
  ('users.manage',        'Просмотр и редактирование пользователей'),
  ('users.ban',           'Блокировка пользователей'),
  ('roles.manage',        'Управление ролями'),
  ('settings.manage',     'Управление настройками'),
  ('news.create',         'Создание новостей'),
  ('news.edit',           'Редактирование новостей'),
  ('news.delete',         'Удаление новостей'),
  ('tournaments.create',  'Создание турниров'),
  ('tournaments.manage',  'Управление турнирами'),
  ('tournaments.finish',  'Завершение турниров');

-- ============================================================
-- Seed: permissions для ADMIN (все)
-- ============================================================
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT r.role_id, p.permission_id
FROM `roles` r, `permissions` p
WHERE r.role_name = 'ADMIN';

-- ============================================================
-- Seed: permissions для MODERATOR
-- ============================================================
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT r.role_id, p.permission_id
FROM `roles` r
JOIN `permissions` p ON p.permission_key IN (
  'news.create', 'news.edit', 'news.delete',
  'tournaments.create', 'tournaments.manage', 'tournaments.finish'
)
WHERE r.role_name = 'MODERATOR';

-- ============================================================
-- Seed: permissions для USER (базовые)
-- ============================================================
INSERT INTO `role_permissions` (`role_id`, `permission_id`)
SELECT r.role_id, p.permission_id
FROM `roles` r
JOIN `permissions` p ON p.permission_key IN ()
WHERE r.role_name = 'USER';

-- ============================================================
-- Migration данных: существующие пользователи → user_roles
-- ============================================================
-- user_role = 1 → роль ADMIN
INSERT INTO `user_roles` (`user_id`, `role_id`)
SELECT u.user_id, r.role_id
FROM `chess_users` u
JOIN `roles` r ON r.role_name = 'ADMIN'
WHERE u.user_role = 1;

-- user_role = 0 → роль USER
INSERT INTO `user_roles` (`user_id`, `role_id`)
SELECT u.user_id, r.role_id
FROM `chess_users` u
JOIN `roles` r ON r.role_name = 'USER'
WHERE u.user_role = 0;
