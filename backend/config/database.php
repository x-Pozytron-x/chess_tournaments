<?php
class Database {
  private static $instance = null;
  private $connection;
  
  private function __construct() {
  $envFile = '../.env';
  $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

  foreach ($lines as $line) {
    if (strpos(trim($line), '#') === 0) { continue;}
    list($name, $value) = explode('=', $line, 2);
    $name = trim($name);
    $value = trim($value);
    $value = trim($value, '"\'');
    $_ENV[$name] = $value;
    $_SERVER[$name] = $value;
  }
  $host = $_ENV['DB_HOST'];
  $dbname = $_ENV['DB_NAME'];
  $username = $_ENV['DB_USER']; 
  $password = $_ENV['DB_PASS']; 
  
  try {
    $this->connection = new PDO(
      "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
      $username,
      $password,
      [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false
      ]
    );
  } catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
  }
}
  
  public static function getInstance() {
    if (self::$instance === null) {
      self::$instance = new Database();
    }
    return self::$instance->connection;
  }
}
?>