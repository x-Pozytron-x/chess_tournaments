<?php

require_once __DIR__ . '/../config/database.php';

// Получение списка пользователей для рейтинга
$db = Database::getInstance();
$sql = "SELECT user_id, user_name, user_rating, created_at FROM chess_users ORDER BY user_rating DESC";
$stmt = $db->query($sql);

$users = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode([
    'success' => true,
    'data' => $users
]);