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

/**
 * POST /api/me/password — смена пароля текущего пользователя
 */
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  require_once __DIR__ . '/../../lib/permissions.php';
  $userId = requireAuth();
  
  $oldPassword = $_POST['old_password'] ?? '';
  $newPassword = $_POST['new_password'] ?? '';
  
  if (empty($oldPassword) || empty($newPassword)) {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'errorCode' => 'MISSING_FIELD'
    ]);
    exit;
  }
  
  if (strlen($newPassword) < 6) {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'errorCode' => 'PASSWORD_TOO_SHORT'
    ]);
    exit;
  }
  
  $db = Database::getInstance();
  
  // Получаем хеш текущего пароля
  $stmt = $db->prepare("SELECT user_password_hash FROM chess_users WHERE user_id = :user_id");
  $stmt->execute([':user_id' => $userId]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);
  
  if (!$user) {
    http_response_code(404);
    echo json_encode(['success' => false, 'errorCode' => 'USER_NOT_FOUND']);
    exit;
  }
  
  // Проверяем старый пароль
  if (!password_verify($oldPassword, $user['user_password_hash'])) {
    http_response_code(401);
    echo json_encode([
      'success' => false,
      'errorCode' => 'INVALID_PASSWORD'
    ]);
    exit;
  }
  
  // Создаём новый хеш
  $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
  
  // Обновляем пароль
  $stmt = $db->prepare("UPDATE chess_users SET user_password_hash = :password_hash WHERE user_id = :user_id");
  $stmt->execute([
    ':password_hash' => $newPasswordHash,
    ':user_id' => $userId
  ]);
  
  echo json_encode([
    'success' => true,
    'message' => 'Password changed successfully'
  ]);
}
