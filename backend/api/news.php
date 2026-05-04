<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

try {
  require_once __DIR__ . '/../config/database.php';
  $db = Database::getInstance();
  
  $stmt = $db->prepare("SELECT * FROM chess_news");
  $stmt->execute();
  $projects = $stmt->fetchAll();

  if ($projects) {
    echo json_encode([
      'success' => true,
      'data' => $projects
    ]);
  }   
} catch (PDOException $e) {
  error_log("Database error: " . $e->getMessage());
  
  http_response_code(500);
  echo json_encode([
      'success' => false, 
      'message' => 'Ошибка сервера. Попробуйте позже.'
  ]);
}