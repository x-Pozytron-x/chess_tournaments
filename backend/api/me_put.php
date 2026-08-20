<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

try {
  require_once __DIR__ . '/../config/database.php';
  require_once __DIR__ . '/../lib/permissions.php';
  $db = Database::getInstance();

  $userId = requireAuth();

  $data = json_decode(file_get_contents('php://input'), true);
  if (!$data) {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'errorCode' => 'INVALID_REQUEST',
      'message' => 'Некорректный формат данных'
    ]);
    exit;
  }

  // Обновление данных в chess_user_data
  $allowedFields = ['user_telegram', 'user_chesscom', 'user_lichess', 'user_email'];
  $updateData = [];
  $updatedFields = [];

  foreach ($allowedFields as $field) {
    if (isset($data[$field])) {
      $updateData[$field] = $data[$field];
      $updatedFields[$field] = $data[$field];
    }
  }

  if (empty($updateData)) {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'errorCode' => 'NO_DATA_TO_UPDATE',
      'message' => 'Не указаны поля для обновления'
    ]);
    exit;
  }

  $setClauses = [];
  foreach ($updateData as $key => $value) {
    $setClauses[] = "`$key` = :$key";
  }

  $setClause = implode(', ', $setClauses);
  $sql = "UPDATE chess_user_data SET $setClause WHERE user_id = :user_id";

  $stmt = $db->prepare($sql);
  $params = array_merge($updateData, [':user_id' => $userId]);

  $stmt->execute($params);

  if ($stmt->rowCount() === 0) {
    http_response_code(404);
    echo json_encode([
      'success' => false,
      'errorCode' => 'USER_NOT_FOUND'
    ]);
    exit;
  }

  $stmt = $db->prepare("SELECT user_telegram, user_chesscom, user_lichess, user_email
    FROM chess_user_data
    WHERE user_id = :user_id
    LIMIT 1
  ");
  $stmt->execute([':user_id' => $userId]);
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