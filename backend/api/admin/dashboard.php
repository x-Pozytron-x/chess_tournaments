<?php

require_once __DIR__ . '/../../config/database.php';
$db = Database::getInstance();

// requireAdmin($db);

// Users count
$stmt = $db->query("
  SELECT COUNT(*) as total
  FROM chess_users
");
$usersCount = (int)$stmt->fetch(PDO::FETCH_ASSOC)['total'];

// Latest users
$stmt = $db->query("
  SELECT user_id, user_name
  FROM chess_users
  ORDER BY user_id DESC
  LIMIT 2
");
$latestUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Latest news
$stmt = $db->query("
  SELECT news_id, news_title, news_date
  FROM chess_news
  ORDER BY news_id DESC
  LIMIT 5
");
$latestNews = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Active tournaments
// $stmt = $db->query("
//   SELECT tournament_id, tournament_name
//   FROM tbl_tournaments
//   WHERE tournament_active = 1
//   LIMIT 5
// ");
// $activeTournaments = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
  'success' => true,
  'data' => [
    'usersCount' => $usersCount,
    'latestUsers' => $latestUsers,
    'latestNews' => $latestNews,
    'activeTournaments' => [],
  ]
]);