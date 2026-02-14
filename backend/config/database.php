<?php
class Database {
  private static $instance = null;
  private $connection;
  
  private function __construct() {
    $host = 'localhost';
    $dbname = 'db_chess';
    $username = 'root';  // ⚠️ Поменяй на свои данные!
    $password = '123';      // ⚠️ Поменяй на свои данные!
    
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