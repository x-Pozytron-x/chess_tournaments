<?php
// backend/api/tournaments/create.php

require_once __DIR__ . '/../../lib/permissions.php';
require_once __DIR__ . '/../../config/database.php';
$db = Database::getInstance();

// Check admin permissions using the proper permissions system
requireAdmin($db);

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'errorCode' => 'METHOD_NOT_ALLOWED',
        'message' => 'Only POST requests are allowed'
    ]);
    exit;
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required_fields = [
    'tournament_name',
    'tournament_format',
    'tournament_status',
    'registration_start',
    'registration_end',
    'start_at',
    'end_at'
];

foreach ($required_fields as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'errorCode' => 'VALIDATION_ERROR',
            'message' => "Field '$field' is required"
        ]);
        exit;
    }
}

// Validate date formats and logic
$dates_to_validate = [
    'registration_start' => $input['registration_start'],
    'registration_end' => $input['registration_end'],
    'start_at' => $input['start_at'],
    'end_at' => $input['end_at']
];

foreach ($dates_to_validate as $date_field => $date_value) {
    if (!DateTime::createFromFormat('Y-m-d H:i', $date_value)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'errorCode' => 'VALIDATION_ERROR',
            'message' => "Invalid date format for $date_field"
        ]);
        exit;
    }
}

// Check date logic: registration end should be before tournament start
$reg_start = new DateTime($input['registration_start']);
$reg_end = new DateTime($input['registration_end']);
$tournament_start = new DateTime($input['start_at']);
$tournament_end = new DateTime($input['end_at']);

if ($reg_end < $reg_start) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'errorCode' => 'VALIDATION_ERROR',
        'message' => 'Registration end date must be after registration start date'
    ]);
    exit;
}

if ($tournament_end < $tournament_start) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'errorCode' => 'VALIDATION_ERROR',
        'message' => 'Tournament end date must be after tournament start date'
    ]);
    exit;
}

// All validations passed, now insert into database
try {
    $tournament_query = "INSERT INTO chess_tournaments (
        tournament_name,
        tournament_description,
        tournament_format,
        tournament_status,
        registration_start,
        registration_end,
        start_at,
        end_at,
        created_at
    ) VALUES (:tournament_name, :tournament_description, :tournament_format, :tournament_status, :registration_start, :registration_end, :start_at, :end_at, NOW())";
    
    $tournament_stmt = $db->prepare($tournament_query);
    
    $result = $tournament_stmt->execute([
        ':tournament_name' => $input['tournament_name'],
        ':tournament_description' => $input['tournament_description'] ?? '',
        ':tournament_format' => $input['tournament_format'],
        ':tournament_status' => $input['tournament_status'],
        ':registration_start' => $input['registration_start'],
        ':registration_end' => $input['registration_end'],
        ':start_at' => $input['start_at'],
        ':end_at' => $input['end_at']
    ]);
    
    if ($result) {
        $tournament_id = $db->lastInsertId();
        echo json_encode([
            'success' => true,
            'data' => [
                'tournament_id' => $tournament_id
            ]
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'errorCode' => 'DATABASE_ERROR',
            'message' => 'Failed to create tournament'
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'errorCode' => 'DATABASE_ERROR',
        'message' => 'Database error occurred: ' . $e->getMessage()
    ]);
}
?>