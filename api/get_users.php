<?php
// Set the content type to JSON
header('Access-Control-Allow-Origin: *'); // Allow all domains (or specify a domain if required)
header('Content-Type: application/json');

// Include the database connection
require_once '../connection.php'; 
// Function to check if a membership is expired
require_once '../functions.php';

try {
    // Initialize variables
    $search = trim($_GET['search'] ?? '');
    $filterMembership = trim($_GET['filterMembership'] ?? 'all');

    // Build the SQL query
    $query = "SELECT id, first_name, last_name, email, username, membership_type, referral_code, last_renewed FROM users WHERE 1=1";

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
