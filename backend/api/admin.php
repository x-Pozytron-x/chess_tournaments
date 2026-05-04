<?php

  require_once __DIR__ . '/../../config/database.php';
  $db = Database::getInstance();

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);

  echo json_encode(['success' => false, 'errorCode' => 'UNAUTHORIZED']);
  exit;
}


$stmt = $db->prepare("SELECT user_id, user_name, user_email, user_fullname, user_role
  FROM chess_users
  WHERE user_id = :user_id
  LIMIT 1
");
$stmt->execute([':user_id' => $_SESSION['user_id']]);

$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user['user_role'] != 1) {
  http_response_code(403);
  echo json_encode(['success' => false, 'errorCode' => 'FORBIDDEN']);
  exit;
}

echo json_encode([
  'success' => true,
  'data' => $user
]);