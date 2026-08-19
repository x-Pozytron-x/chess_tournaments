<?php
/**
 * GET /api/roles — список всех ролей (для admin UI).
 */

require_once __DIR__ . '/../../lib/permissions.php';
require_once __DIR__ . '/../../config/database.php';
$db = Database::getInstance();

requireAdmin($db);

if ($method === 'GET') {
  try {
    $roles = getAllRoles($db);
    echo json_encode(['success' => true, 'data' => $roles]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'errorCode' => $e->getMessage()]);
  }
  exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'errorCode' => 'METHOD_NOT_ALLOWED']);
