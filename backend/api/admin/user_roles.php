<?php
/**
 * PUT /admin/users/roles
 *
 * Body: { "user_id": 5, "role_ids": [1, 2] }
 *
 * Заменяет все роли пользователя на указанные.
 * Требует permission roles.manage.
 */

require_once __DIR__ . '/../../lib/permissions.php';
require_once __DIR__ . '/../../config/database.php';
$db = Database::getInstance();

requireAdmin($db);

if ($method !== 'PUT') {
  http_response_code(405);
  echo json_encode(['success' => false, 'errorCode' => 'METHOD_NOT_ALLOWED']);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);

$userId  = $input['user_id'] ?? null;
$roleIds = $input['role_ids'] ?? null;

if (!$userId || !is_array($roleIds)) {
  http_response_code(400);
  echo json_encode(['success' => false, 'errorCode' => 'VALIDATION']);
  exit;
}

// Проверяем, что все role_id существуют
if (!empty($roleIds)) {
  $placeholders = implode(',', array_fill(0, count($roleIds), '?'));
  $stmt = $db->prepare("SELECT role_id FROM roles WHERE role_id IN ($placeholders)");
  $stmt->execute($roleIds);
  $found = $stmt->fetchAll(PDO::FETCH_COLUMN);

  if (count($found) !== count($roleIds)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errorCode' => 'INVALID_ROLE']);
    exit;
  }
}

try {
  setUserRoles($db, (int)$userId, $roleIds);

  // Синхронизируем legacy user_role в chess_users
  $hasAdmin = hasRole($db, (int)$userId, 'ADMIN');
  $newLegacyRole = $hasAdmin ? 1 : 0;

  $stmt = $db->prepare("UPDATE chess_users SET user_role = :role WHERE user_id = :user_id");
  $stmt->execute([':role' => $newLegacyRole, ':user_id' => (int)$userId]);

  echo json_encode(['success' => true]);
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(['success' => false, 'errorCode' => 'SERVER_ERROR']);
}
