<?php

require_once __DIR__ . '/../../lib/permissions.php';
require_once __DIR__ . '/../../config/database.php';
$db = Database::getInstance();

requireAdmin($db);

// GET — список всех пользователей с ролями и разрешениями
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

    // Обогащаем каждого пользователя ролями и разрешениями
    foreach ($users as &$user) {
      $result = getUserRolesAndPermissions($db, (int)$user['user_id']);
      $user['roles'] = $result['roles'];
      $user['permissions'] = $result['permissions'];
    }
    unset($user);

    echo json_encode(['success' => true, 'data' => $users]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'errorCode' => 'SERVER_ERROR']);
  }
  exit;
}

// PUT — обновление пользователя (существующая логика)
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

    // Синхронизируем legacy user_role с таблицей roles
    // Если user_role = 1 → добавляем ADMIN, убираем USER
    // Если user_role = 0 → добавляем USER, убираем ADMIN
    if ($role !== null) {
      $adminRole = $db->query("SELECT role_id FROM roles WHERE role_name = 'ADMIN'")->fetch(PDO::FETCH_ASSOC);
      $userRole  = $db->query("SELECT role_id FROM roles WHERE role_name = 'USER'")->fetch(PDO::FETCH_ASSOC);

      if ($adminRole && $userRole) {
        if ((int)$role === 1) {
          assignRole($db, (int)$user_id, (int)$adminRole['role_id']);
          removeRole($db, (int)$user_id, (int)$userRole['role_id']);
        } else {
          assignRole($db, (int)$user_id, (int)$userRole['role_id']);
          removeRole($db, (int)$user_id, (int)$adminRole['role_id']);
        }
      }
    }

    echo json_encode(['success' => true]);
  } catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'errorCode' => 'SERVER_ERROR']);
  }
  exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'errorCode' => 'METHOD_NOT_ALLOWED']);
