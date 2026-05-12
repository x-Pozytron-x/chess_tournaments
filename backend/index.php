<?php

// header("Access-Control-Allow-Origin: http://localhost:5173");
// header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header("Access-Control-Allow-Credentials: true");

session_start();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$path = $_SERVER['REQUEST_URI'] ?? '';
$method = $_SERVER['REQUEST_METHOD'];


if (($pos = strpos($path, '?')) !== false) {
  $path = substr($path, 0, $pos);
}

$path = trim($path, '/');

if ($method === 'GET') {
  if ($path === 'news') {
   require_once __DIR__ . '/api/news.php';
    exit;
  }
}
if ($method === 'GET') {
  if ($path === 'me') {
   require_once __DIR__ . '/api/auth/me.php';
    exit;
  }
}


if ($method === 'POST') {
  if ($path === 'login') {
    require_once __DIR__ . '/api/auth/login.php';
    exit;
  }
  if ($path === 'register') {
    require_once __DIR__ . '/api/auth/register.php';
    exit;
  }
  if ($path === 'logout') {
    require_once __DIR__ . '/api/auth/logout.php';
    exit;
  }
}
// admin 
if ($method === 'GET') {
  if ($path === 'admin/news') {
    require_once __DIR__ . '/api/admin/news.php';
    exit;
  }
}

http_response_code(404);
echo json_encode([
  'error' => 'Not Found',
  'path' => $path,
  'method' => $method
]);