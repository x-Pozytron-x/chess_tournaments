<?php

require_once __DIR__ . '/../../config/database.php';
require_once __DIR__ . '/../../lib/permissions.php';
$db = Database::getInstance();

$userId = requireAuth();

$stmt = $db->prepare("SELECT user_id, user_name, user_email, user_fullname, user_avatar,
  user_rating, user_telegram, user_chesscom, user_lichess,
  user_role, is_active, created_at
  FROM chess_users
  WHERE user_id = :user_id
  LIMIT 1
");
$stmt->execute([':user_id' => $userId]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
  http_response_code(404);
  echo json_encode(['success' => false, 'errorCode' => 'USER_NOT_FOUND']);
  exit;
}

// Обогащаем роли и разрешениями (безопасно — пустые массивы, если таблиц нет)
$result = getUserRolesAndPermissions($db, $userId);
$user['roles'] = $result['roles'];
$user['permissions'] = $result['permissions'];

echo json_encode([
  'success' => true,
  'data' => $user
]);
