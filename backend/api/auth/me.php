<?php

session_start();

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['success' => false, 'errorCode' => 'UNAUTHORIZED']);
  exit;
}

$user = get_user($_SESSION['user_id']);
unset($user['user_password_hash']);

echo json_encode([
  'success' => true,
  'data' => $user
]);