<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

try {
  require_once __DIR__ . '/../config/database.php';
  $db = Database::getInstance();
  
  $userName = $_GET['user_name'] ?? null;
  
  if (!$userName) {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'errorCode' => 'MISSING_PARAMETER',
      'message' => 'Параметр user_name обязателен'
    ]);
    exit;
  }
  
  $stmt = $db->prepare("SELECT user_id, user_name, user_rating, user_telegram, user_chesscom, user_lichess, is_active, created_at
    FROM chess_users
    WHERE user_name = :user_name
    LIMIT 1
  ");
  $stmt->execute([':user_name' => $userName]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if (!$user) {
    http_response_code(404);
    echo json_encode([
      'success' => false,
      'errorCode' => 'USER_NOT_FOUND'
    ]);
    exit;
  }
  
  echo json_encode([
    'success' => true,
    'data' => $user
  ]);
} catch (PDOException $e) {
  error_log("Database error: " . $e->getMessage());
  
  http_response_code(500);
  echo json_encode([
    'success' => false,
    'message' => 'Ошибка сервера. Попробуйте позже.'
  ]);
}