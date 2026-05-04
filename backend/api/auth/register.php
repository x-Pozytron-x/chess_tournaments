<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");

$input = json_decode(file_get_contents('php://input'), true);

// Проверяем обязательные поля нашей формы
if (!$input || !isset($input['login']) || !isset($input['pass']) || !isset($input['invited'])) {
    http_response_code(400);
    echo json_encode([
      'success' => false, 
      'errorCode' => 'EMPTY_FIELD'
      ]);
    exit;
}

$login    = trim($input['login']);
$pass     = $input['pass'];
$repass   = $input['repass'] ?? '';
$invited  = trim($input['invited']);
$agree    = $input['agree'] ?? false;

// Валидация — собираем все ошибки сразу, как на фронте
$errors = [];

if (!preg_match('/^[a-zA-Z0-9_а-яёА-ЯЁ]{3,20}$/u', $login)) {
    $errors['login'] = 'Никнейм: 3–20 символов, только буквы, цифры и _';
}

if (strlen($pass) < 8) {
    $errors['pass'] = 'Пароль должен быть не менее 8 символов';
}

if ($pass !== $repass) {
    $errors['repass'] = 'Пароли не совпадают';
}

if (empty($invited)) {
    $errors['invited'] = 'Укажи ник того, кто тебя пригласил';
}

if (!$agree) {
    $errors['agree'] = 'Нужно согласиться с правилами';
}

if (!empty($errors)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'errors' => $errors]);
    exit;
}

try {
    require_once __DIR__ . '/../../config/database.php';
    $db = Database::getInstance();

    // Проверяем что пригласивший существует
    // $stmt = $db->prepare("SELECT user_id FROM tbl_users WHERE user_name = :invited");
    // $stmt->execute([':invited' => $invited]);
    // if (!$stmt->fetch()) {
    //     http_response_code(422);
    //     echo json_encode(['success' => false, 'errors' => [
    //         'invited' => 'Пользователь с таким ником не найден'
    //     ]]);
    //     exit;
    // }

    // Проверяем уникальность никнейма
    $stmt = $db->prepare("SELECT user_id FROM chess_users WHERE user_name = :login");
    $stmt->execute([':login' => $login]);
    if ($stmt->fetch()) {
        http_response_code(422);
        echo json_encode([
          'success' => false, 
          'errorCode' => 'USER_EXISTS'
        ]);
        exit;
    }

    $password_hash = password_hash($pass, PASSWORD_BCRYPT);

    // Вставляем только то что знаем — остальное по DEFAULT из схемы
    $stmt = $db->prepare("
        INSERT INTO chess_users (user_name, user_email, user_password_hash, is_active)
        VALUES (:user_name, :user_email, :user_password_hash, 0)
    ");
    $stmt->execute([
        ':user_name'          => $login,
        ':user_email'         => '',
        ':user_password_hash' => $password_hash,
    ]);

    $user_id = $db->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Регистрация успешна',
        'data' => [
            'id'       => $user_id,
            'username' => $login,
        ]
    ]);

} catch (PDOException $e) {
    error_log("Register error: " . $e->getMessage());
    http_response_code(500);
  echo json_encode([
      'success' => false, 
      'errorCode' => 'NETWORK_ERROR'
  ]);
}