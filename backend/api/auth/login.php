<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['username']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'errorCode' => 'EMPTY_FIELD'
    ]);
    exit;
}

$username = trim($input['username']);
$password = $input['password'];
$remember = !empty($input['remember']);

try {
  require_once __DIR__ . '/../../config/database.php';
  $db = Database::getInstance();
  
  $stmt = $db->prepare("SELECT user_id, user_name, user_email, user_password_hash, user_fullname, user_role FROM tbl_users WHERE (user_name = :username) AND is_active = TRUE");
  $stmt->execute([':username' => $username]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
  if (!$user) {
    http_response_code(401);
    echo json_encode([
      'success' => false,
      'errorCode' => 'UNKNOWN_USER'
    ]);
    exit;
  }
  
  if (!password_verify($password, $user['user_password_hash'])) {
    http_response_code(401);
    echo json_encode([
      'success' => false,
      'errorCode' => 'INVALID_PASSWORD'
    ]);
    exit;
  }
    
  // Вариант 1: Используем PHP сессии (проще)
  session_start();
  $_SESSION['user_id'] = $user['id'];
  $_SESSION['username'] = $user['username'];
  
  if ($remember) {
    setcookie(session_name(), session_id(), time() + 60*60*24*30, "/", "", false, true);
  }

  unset($user['user_password_hash']);
  
  echo json_encode([
    'success' => true,
    //'message' => 'Вход выполнен успешно',
    'data' => $user,
    'token' => session_id() // или JWT токен
  ]);
    
} catch (PDOException $e) {
  error_log("Login error: " . $e->getMessage());
  
  http_response_code(500);
  echo json_encode([
      'success' => false, 
      'errorCode' => 'NETWORK_ERROR'
  ]);
}