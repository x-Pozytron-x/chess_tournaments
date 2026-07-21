<?php

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['success' => false, 'errorCode' => 'UNAUTHORIZED']);
  exit;
}

require_once __DIR__ . '/../../config/database.php';
$db = Database::getInstance();

$stmt = $db->prepare("SELECT user_role FROM chess_users WHERE user_id = :id LIMIT 1");
$stmt->execute([':id' => $_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || $user['user_role'] != 1) {
  http_response_code(403);
  echo json_encode(['success' => false, 'errorCode' => 'FORBIDDEN']);
  exit;
}

// GET — список всех пользователей
if ($method === 'GET') {
  try {
    $stmt = $db->query("
      SELECT user_id, user_name, user_email, user_fullname, user_avatar,
             user_rating, user_telegram, user_chesscom, user_lichess,
             user_role, is_active, created_at
      FROM chess_users
      ORDER BY user_id DESC
    ");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $users]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'errorCode' => 'SERVER_ERROR']);
  }
  exit;
}

// PUT — обновление пользователя
if ($method === 'PUT') {
  $input = json_decode(file_get_contents('php://input'), true);

  $user_id    = $input['user_id'] ?? null;
  $fullname   = $input['user_fullname'] ?? null;
  $role       = $input['user_role'] ?? null;
  $is_active  = $input['is_active'] ?? null;
  $rating     = $input['user_rating'] ?? null;
  $telegram   = $input['user_telegram'] ?? null;
  $chesscom   = $input['user_chesscom'] ?? null;
  $lichess    = $input['user_lichess'] ?? null;

  if (!$user_id) {
    http_response_code(400);
    echo json_encode(['success' => false, 'errorCode' => 'VALIDATION']);
    exit;
  }

  try {
    $stmt = $db->prepare("
      UPDATE chess_users
      SET user_fullname  = :fullname,
          user_role      = :role,
          is_active      = :is_active,
          user_rating    = :rating,
          user_telegram  = :telegram,
          user_chesscom  = :chesscom,
          user_lichess   = :lichess
      WHERE user_id = :user_id
    ");
    $stmt->execute([
      ':fullname'  => $fullname,
      ':role'      => $role,
      ':is_active' => $is_active,
      ':rating'    => $rating,
      ':telegram'  => $telegram,
      ':chesscom'  => $chesscom,
      ':lichess'   => $lichess,
      ':user_id'   => $user_id,
    ]);
    echo json_encode(['success' => true]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'errorCode' => 'SERVER_ERROR']);
  }
  exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'errorCode' => 'METHOD_NOT_ALLOWED']);
