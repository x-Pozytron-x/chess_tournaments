<?php
// backend/api/tournaments/index.php
require_once __DIR__ . '/../../config/database.php';
$db = Database::getInstance();

// Allow access to all users, not just admins
// This endpoint should be publicly accessible for home page

// Check if request method is GET
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'errorCode' => 'METHOD_NOT_ALLOWED',
        'message' => 'Only GET requests are allowed'
    ]);
    exit;
}

try {
    $query = "SELECT 
        tournament_id,
        tournament_name,
        tournament_description,
        tournament_format,
        tournament_status,
        registration_start,
        registration_end,
        start_at,
        end_at,
        created_at
    FROM chess_tournaments 
    ORDER BY created_at DESC";
    
    $stmt = $db->prepare($query);
    $stmt->execute();
    
    $tournaments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'tournaments' => $tournaments
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'errorCode' => 'DATABASE_ERROR',
        'message' => 'Database error occurred: ' . $e->getMessage()
    ]);
}
?>