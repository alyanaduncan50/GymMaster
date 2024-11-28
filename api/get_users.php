<?php
session_start();
// Set the content type to JSON
header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/json');

// Include the database connection
require_once '../connection.php'; 
require_once '../config.php'; 
// Function to check if a membership is expired
require_once '../functions.php';

try {
    $headers = apache_request_headers();
    $clientToken = $headers['Authorization'] ?? '';
    $clientToken = str_replace('Bearer ', '', $clientToken);

    // Check if the session has a valid token
    if (!isset($_SESSION['token']) || $clientToken !== $_SESSION['token']) {
        http_response_code(401);
        $response['success'] = false;
        $response['code'] = '401';
        $response['redirect_url'] = BASE_URL.'login.html';
        $response['message'] = 'Unauthorized: Invalid or missing token.';
        echo json_encode($response);
        exit;
    }
    // Initialize variables
    $search = trim($_GET['search'] ?? '');
    $filterMembership = trim($_GET['filterMembership'] ?? 'all');

    // Build the SQL query
    $query = "SELECT id, first_name, last_name, email, username, membership_type, referral_code, last_renewed FROM users WHERE 1=1 AND username != 'admin'";

    // Parameters for prepared statement
    $params = [];

    // Add search condition if provided
    if (!empty($search)) {
        $query .= " AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ?)";
        $searchTerm = "%$search%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    //process alphabetically by first name, then last name
    $query .= " ORDER BY first_name ASC, last_name ASC";

    // Prepare and execute the statement
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);

    // Fetch results
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Process membership filters and determine Active/Expired
    $filteredUsers = [];
    foreach ($users as &$user) {
        $user['status'] = isMembershipExpired($user['last_renewed']) ? 'Expired' : 'Active';   

        // Filter by membership status only if not "all"
        if ($filterMembership !== 'all' && strtolower($user['status']) !== strtolower($filterMembership)) {
            continue;
        }

        $filteredUsers[] = $user;
    }

    // Return JSON response
    echo json_encode([
        'success' => true,
        'data' => $filteredUsers,
    ]);
} catch (PDOException $e) {
    // Handle errors
    echo json_encode([
        'success' => false,
        'message' => 'Error retrieving users: ' . $e->getMessage(),
    ]);
}
?>
