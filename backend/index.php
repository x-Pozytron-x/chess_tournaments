<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');


require_once __DIR__ . '/config/env.php';

$isProd = getenv('APP_ENV') === 'production';
// $isProd = (false) ? "api/" : "";


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

$path = trim($path, "/" );

if ($method === 'GET') {
  if ($path === $isProd . 'news') {
   require_once __DIR__ . '/api/news.php';
    exit;
  }
}
if ($method === 'GET') {
  if ($path === $isProd . 'me') {
    require_once __DIR__ . '/api/auth/me.php';
    exit;
  }
}
if ($method === 'POST') {
  if ($path === $isProd . 'me') {
    require_once __DIR__ . '/api/auth/me.php';
    exit;
  }
  if ($path === $isProd . 'me/password') {
    require_once __DIR__ . '/api/auth/me.php';
    exit;
  }
}


if ($method === 'POST') {
  if ($path === $isProd . 'login') {
    require_once __DIR__ . '/api/auth/login.php';
    exit;
  }
  if ($path === $isProd . 'register') {
    require_once __DIR__ . '/api/auth/register.php';
    exit;
  }
  if ($path === $isProd . 'logout') {
    require_once __DIR__ . '/api/auth/logout.php';
    exit;
  }
}
// admin 
if ($method === 'GET') {
  if ($path === $isProd . 'admin/news') {
    require_once __DIR__ . '/api/admin/news.php';
    exit;
  }
}

if ($method === 'POST') {
  if ($path === $isProd . 'admin/news') {
    $cmd = 'news_add';
    require_once __DIR__ . '/api/admin/news.php';
    exit;
  }
  if ($path === $isProd . 'admin/tournaments') {
    require_once __DIR__ . '/api/tournaments/create.php';
    exit;
  }
}
if ($method === 'PUT') {
  if ($path === $isProd . 'admin/news') {
    $cmd = 'news_save';
    require_once __DIR__ . '/api/admin/news.php';
    exit;
  }
  if ($path === $isProd . 'me') {
    require_once __DIR__ . '/api/me_put.php';
    exit;
  }
}
if ($method === 'DELETE') {
  if ($path === $isProd . 'admin/news') {
    $cmd = 'news_delete';
    require_once __DIR__ . '/api/admin/news.php';
    exit;
  }
}
if ($method === 'GET') {
  if ($path === $isProd . 'admin/dashboard') {
    require_once __DIR__ . '/api/admin/dashboard.php';
    exit;
  }
}
  if ($path === $isProd . 'tournaments') {
    require_once __DIR__ . '/api/tournaments/index.php';
    exit;
  }

// admin user roles
if ($method === 'GET') {
  if ($path === $isProd . 'admin/roles') {
    require_once __DIR__ . '/api/admin/roles.php';
    exit;
  }
}
if ($method === 'PUT') {
  if ($path === $isProd . 'admin/users/roles') {
    require_once __DIR__ . '/api/admin/user_roles.php';
    exit;
  }
}

// admin users
if ($method === 'GET') {
  if ($path === $isProd . 'admin/users') {
    require_once __DIR__ . '/api/admin/users.php';
    exit;
  }
}
if ($method === 'PUT') {
  if ($path === $isProd . 'admin/users') {
    require_once __DIR__ . '/api/admin/users.php';
    exit;
  }
}

// public users list
if ($method === 'GET') {
  if ($path === $isProd . 'users') {
    require_once __DIR__ . '/api/users.php';
    exit;
  }
  // public user by name
  if (preg_match('/^users\/([^\/]+)$/', $path, $matches)) {
    $_GET['user_name'] = $matches[1];
    require_once __DIR__ . '/api/users.php';
    exit;
  }
  // public rating list
  if ($path === $isProd . 'rating') {
    require_once __DIR__ . '/api/rating.php';
    exit;
  }
}


http_response_code(404);
echo json_encode([
  'error' => 'Not Found',
  'path' => $path,
  'method' => $method
]);