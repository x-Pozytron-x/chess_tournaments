-- ============================================================
-- Migration 003: Migrate existing users to RBAC
-- Created: 2026-07-22
-- Description: Copies chess_users.user_role into user_roles.
--              Safe to run multiple times (INSERT IGNORE).
-- ============================================================

-- user_role = 1 → роль ADMIN
INSERT IGNORE INTO `user_roles` (`user_id`, `role_id`)
SELECT u.user_id, r.role_id
FROM `chess_users` u
JOIN `roles` r ON r.role_name = 'ADMIN'
WHERE u.user_role = 1;

-- user_role = 0 → роль USER
INSERT IGNORE INTO `user_roles` (`user_id`, `role_id`)
SELECT u.user_id, r.role_id
FROM `chess_users` u
JOIN `roles` r ON r.role_name = 'USER'
WHERE u.user_role = 0;
