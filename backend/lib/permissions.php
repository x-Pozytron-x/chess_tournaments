<?php
/**
 * Roles & Permissions — общие функции для backend.
 *
 * Использование:
 *   require_once __DIR__ . '/../lib/permissions.php';
 *   if (!hasPermission($db, $userId, 'news.create')) { ... 403 ... }
 *   if (!hasRole($db, $userId, 'ADMIN')) { ... 403 ... }
 */

/**
 * Проверяет, есть ли у пользователя указанная роль.
 */
function hasRole(PDO $db, int $userId, string $roleName): bool
{
  $stmt = $db->prepare("
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.role_id = ur.role_id
    WHERE ur.user_id = :user_id AND r.role_name = :role_name
    LIMIT 1
  ");
  $stmt->execute([':user_id' => $userId, ':role_name' => $roleName]);
  return (bool) $stmt->fetch();
}

/**
 * Проверяет, есть ли у пользователя указанное разрешение.
 * Разрешение наследуется через все роли пользователя.
 */
function hasPermission(PDO $db, int $userId, string $permissionKey): bool
{
  $stmt = $db->prepare("
    SELECT 1
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN permissions p ON p.permission_id = rp.permission_id
    WHERE ur.user_id = :user_id AND p.permission_key = :permission_key
    LIMIT 1
  ");
  $stmt->execute([':user_id' => $userId, ':permission_key' => $permissionKey]);
  return (bool) $stmt->fetch();
}

/**
 * Возвращает все роли пользователя.
 */
function getUserRoles(PDO $db, int $userId): array
{
  $stmt = $db->prepare("
    SELECT r.role_id, r.role_name, r.description
    FROM user_roles ur
    JOIN roles r ON r.role_id = ur.role_id
    WHERE ur.user_id = :user_id
    ORDER BY r.role_name
  ");
  $stmt->execute([':user_id' => $userId]);
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Возвращает все разрешения пользователя (объединение всех ролей).
 */
function getUserPermissions(PDO $db, int $userId): array
{
  $stmt = $db->prepare("
    SELECT DISTINCT p.permission_key, p.description
    FROM user_roles ur
    JOIN role_permissions rp ON rp.role_id = ur.role_id
    JOIN permissions p ON p.permission_id = rp.permission_id
    WHERE ur.user_id = :user_id
    ORDER BY p.permission_key
  ");
  $stmt->execute([':user_id' => $userId]);
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Возвращает все роли из таблицы roles.
 */
function getAllRoles(PDO $db): array
{
  $stmt = $db->query("SELECT role_id, role_name, description FROM roles ORDER BY role_name");
  return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Назначает роль пользователю.
 * Игнорирует, если роль уже назначена (INSERT IGNORE).
 */
function assignRole(PDO $db, int $userId, int $roleId): void
{
  $stmt = $db->prepare("
    INSERT IGNORE INTO user_roles (user_id, role_id)
    VALUES (:user_id, :role_id)
  ");
  $stmt->execute([':user_id' => $userId, ':role_id' => $roleId]);
}

/**
 * Удаляет роль у пользователя.
 */
function removeRole(PDO $db, int $userId, int $roleId): void
{
  $stmt = $db->prepare("
    DELETE FROM user_roles
    WHERE user_id = :user_id AND role_id = :role_id
  ");
  $stmt->execute([':user_id' => $userId, ':role_id' => $roleId]);
}

/**
 * Заменяет все роли пользователя на указанные.
 * Удаляет старые, назначает новые.
 */
function setUserRoles(PDO $db, int $userId, array $roleIds): void
{
  $db->beginTransaction();
  try {
    $stmt = $db->prepare("DELETE FROM user_roles WHERE user_id = :user_id");
    $stmt->execute([':user_id' => $userId]);

    $stmt = $db->prepare("INSERT INTO user_roles (user_id, role_id) VALUES (:user_id, :role_id)");
    foreach ($roleIds as $roleId) {
      $stmt->execute([':user_id' => $userId, ':role_id' => (int)$roleId]);
    }

    $db->commit();
  } catch (Exception $e) {
    $db->rollBack();
    throw $e;
  }
}

/**
 * Проверка admin-доступа.
 * Проверяет наличие permission 'admin.access' через систему ролей.
 * Legacy user_role используется как fallback для обратной совместимости.
 */
function requireAdmin(PDO $db): void
{
  if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'errorCode' => 'UNAUTHORIZED']);
    exit;
  }

  $userId = (int)$_SESSION['user_id'];

  // Новая система: проверка permission через roles
  try {
    if (hasPermission($db, $userId, 'admin.access')) {
      return;
    }
  } catch (PDOException $e) {
    // Таблицы RBAC ещё не созданы — fallback на legacy
  }

  // Legacy fallback: user_role = 1 (для пользователей до миграции)
  $stmt = $db->prepare("SELECT user_role FROM chess_users WHERE user_id = :id LIMIT 1");
  $stmt->execute([':id' => $userId]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($user && $user['user_role'] == 1) {
    return;
  }

  http_response_code(403);
  echo json_encode(['success' => false, 'errorCode' => 'FORBIDDEN']);
  exit;
}

/**
 * Проверка авторизации (без проверки роли).
 * Если пользователь не залогинен — 401.
 * Возвращает user_id.
 */
function requireAuth(): int
{
  if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'errorCode' => 'UNAUTHORIZED']);
    exit;
  }
  return (int)$_SESSION['user_id'];
}

/**
 * Безопасное получение ролей и разрешений.
 * Если таблицы RBAC не существуют или пользователь не мигрирован —
 * добавляет права на основе legacy user_role.
 * Используется в login.php и me.php.
 */
function getUserRolesAndPermissions(PDO $db, int $userId): array
{
  try {
    $roles = getUserRoles($db, $userId);
  } catch (PDOException $e) {
    $roles = [];
  }

  try {
    $permissionRows = getUserPermissions($db, $userId);
    $permissions = array_column($permissionRows, 'permission_key');
  } catch (PDOException $e) {
    $permissions = [];
  }

  // Legacy fallback: если RBAC-таблицы пусты или не существуют,
  // подставляем права на основе user_role
  if (empty($roles) && empty($permissions)) {
    $stmt = $db->prepare("SELECT user_role FROM chess_users WHERE user_id = :id LIMIT 1");
    $stmt->execute([':id' => $userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
      if ((int)$user['user_role'] === 1) {
        $roles = [['role_id' => 0, 'role_name' => 'ADMIN', 'description' => 'Legacy admin']];
        $permissions = ['admin.access'];
      } else {
        $roles = [['role_id' => 0, 'role_name' => 'USER', 'description' => 'Legacy user']];
        $permissions = [];
      }
    }
  }

  return ['roles' => $roles, 'permissions' => $permissions];
}
