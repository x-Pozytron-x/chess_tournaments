<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");

$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['username']) || !isset($input['email']) || !isset($input['password'])) {
  http_response_code(400);
  echo json_encode(['success' => false, 'message' => 'Заполните все поля']);
  exit;
}

$username = trim($input['username']);
$email = trim($input['email']);
$password = $input['password'];
$full_name = $input['full_name'] ?? '';

// Валидация
if (strlen($password) < 6) {
  echo json_encode(['success' => false, 'message' => 'Пароль должен быть не менее 6 символов']);
  exit;
}

try {
  require_once __DIR__ . '/../config/database.php';
  $db = Database::getInstance();
  
  // Проверяем, не занят ли username или email
  $stmt = $db->prepare("SELECT id FROM tbl_users WHERE username = :username OR email = :email");
  $stmt->execute([':username' => $username, ':email' => $email]);
  
  if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Пользователь с таким логином или email уже существует']);
    exit;
  }
  
  // Хэшируем пароль
  $password_hash = password_hash($password, PASSWORD_DEFAULT);
  
  // Создаем пользователя
  $stmt = $db->prepare("INSERT INTO users (username, email, password_hash, full_name, rating) VALUES (:username, :email, :password_hash, :full_name, 1200)");
  $stmt->execute([
    ':username' => $username,
    ':email' => $email,
    ':password_hash' => $password_hash,
    ':full_name' => $full_name
  ]);
  
  $user_id = $db->lastInsertId();
  
  echo json_encode([
    'success' => true,
    'message' => 'Регистрация успешна',
    'user' => [
      'id' => $user_id,
      'username' => $username,
      'email' => $email,
      'full_name' => $full_name,
      'rating' => 1200
    ]
  ]);

} catch (PDOException $e) {
  error_log("Register error: " . $e->getMessage());
  http_response_code(500);
  echo json_encode(['success' => false, 'message' => 'Ошибка при регистрации']);
}