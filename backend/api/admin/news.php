
<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");

$input = json_decode(file_get_contents('php://input'), true);

$title = trim($input['title'] ?? '');
$text  = trim($input['text'] ?? '');

if (!isset($_SESSION['user_id'])) {
  http_response_code(401);
  echo json_encode(['success' => false, 'errorCode' => 'UNAUTHORIZED']);
  exit;
}

if ($user['user_role'] != 1) {
  http_response_code(403);
  echo json_encode(['success' => false, 'errorCode' => 'FORBIDDEN']);
  exit;
}

if ($title === '' || $text === '') {
  http_response_code(400);
  echo json_encode(['success' => false, 'errorCode' => 'VALIDATION']);
  exit;
}

  require_once __DIR__ . '/../../config/database.php';
  $db = Database::getInstance();

if ($method === 'GET' ) {
  try {
    $stmt = $db->prepare("SELECT * FROM chess_news");
    $stmt->execute();
    $news = $stmt->fetchAll();
    
    if ($news) {
      echo json_encode([
        'success' => true,
        'data' => $projects
      ]);
    } 
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
      'success' => false, 
      'errorCode' => 'NETWORK_ERROR'
    ]);
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