<?php

  require_once __DIR__ . '/../../config/database.php';
  $db = Database::getInstance();

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);

  echo json_encode(['success' => false, 'errorCode' => 'UNAUTHORIZED']);
  exit;
}
unset($user['user_password_hash']);


$stmt = $db->prepare("SELECT user_id, user_name, user_email, user_fullname, user_role
  FROM tbl_users
  WHERE user_id = :user_id
  LIMIT 1
");
$stmt->execute([':user_id' => $_SESSION['user_id']]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
  'success' => true,
  'data' => $user
]);