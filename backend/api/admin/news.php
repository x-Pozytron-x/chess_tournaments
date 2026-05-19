<?php 

if (!isset($_SESSION['user_id'])) {
  http_response_code(401); 
  echo json_encode([
    'success' => false,
    'errorCode' => 'UNAUTHORIZED'
  ]); 
  exit;
}
require_once __DIR__ . '/../../config/database.php';
//header('Content-Type: application/json');
$db = Database::getInstance();

$stmt = $db->prepare("
  SELECT user_role
  FROM chess_users
  WHERE user_id = :id
  LIMIT 1
");
$stmt->execute([':id' => $_SESSION['user_id']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || $user['user_role'] != 1) {
  http_response_code(403);
  echo json_encode([
    'success' => false,
    'errorCode' => 'FORBIDDEN'
  ]);
  exit;
}


if ($method === 'GET') {
  try {
    $stmt = $db->prepare("
      SELECT *
      FROM chess_news
      ORDER BY news_id DESC
    ");
    $stmt->execute();
    $news = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode([
      'success' => true,
      'data' => $news
    ]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      'success' => false,
      'errorCode' => 'SERVER_ERROR'
    ]);
  }
  exit;
}

if ($method === 'POST' && $cmd === 'news_add') {

  $input = json_decode(file_get_contents('php://input'), true);

  $title = trim($input['title'] ?? '');
  $text  = trim($input['text'] ?? '');

  if ($title === '' || $text === '') {
    http_response_code(400);
    echo json_encode(['success' => false, 'errorCode' => 'VALIDATION']);
    exit;
  }
  if (mb_strlen($title) > 150) {
    http_response_code(400);
    echo json_encode([
      'success' => false,
      'errorCode' => 'TITLE_TOO_LONG'
    ]);
    exit;
  }

  try {
    $stmt = $db->prepare("
      INSERT INTO chess_news (
        news_title,
        news_descr,
        news_status,
        news_date
      )
      VALUES (
        :title,
        :text,
        :status,
        :date
      )
    ");

    $stmt->execute([
      ':title' => $title,
      ':text'  => $text,
      ':status' => '0',
      ':date' => "00.00.0000"
    ]);
    echo json_encode([
      'success' => true
    ]);

  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      'success' => false,
      'errorCode' => 'SERVER_ERROR'
    ]);
  }
  exit;
}


//     // Вставляем только то что знаем — остальное по DEFAULT из схемы
//     $stmt = $db->prepare("
//         INSERT INTO chess_users (user_name, user_email, user_password_hash, is_active)
//         VALUES (:user_name, :user_email, :user_password_hash, 0)
//     ");
//     $stmt->execute([
//         ':user_name'          => $login,
//         ':user_email'         => '',
//         ':user_password_hash' => $password_hash,
//     ]);

//     $user_id = $db->lastInsertId();

//     echo json_encode([
//         'success' => true,
//         'message' => 'Регистрация успешна',
//         'data' => [
//             'id'       => $user_id,
//             'username' => $login,
//         ]
//     ]);

// } catch (PDOException $e) {
//     error_log("Register error: " . $e->getMessage());
//     http_response_code(500);
//   echo json_encode([
//       'success' => false, 
//       'errorCode' => 'NETWORK_ERROR'
//   ]);
// }