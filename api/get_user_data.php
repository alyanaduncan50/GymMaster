<?php
session_start();
// Set the content type to JSON
header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/json');

// Include the database connection
require_once '../connection.php'; 
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
        $response['redirect_url'] = `${BASE_URL}login.html`;
        $response['message'] = 'Unauthorized: Invalid or missing token.';
        echo json_encode($response);
        exit;
    }

    $query = "SELECT first_name, last_name, membership_type, referral_code, last_renewed 
    FROM users 
    WHERE username = :username LIMIT 1";

    $username = $_SESSION['user']['username'];
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();

    // Check if the user exists
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'User not found.',
        ]);
        exit;
    }

    // Fetch user data
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    $lastRenewedDate = new DateTime($user['last_renewed']);
    $expiryDate = $lastRenewedDate->add(new DateInterval('P30D')); // Add 30 days

    // Add expiry date to the user data
    $user['expiry_date'] = $expiryDate->format('Y-m-d');

    // Return JSON response
    echo json_encode([
        'success' => true,
        'data' => $user,
    ]);
} catch (PDOException $e) {
    // Handle errors
    echo json_encode([
        'success' => false,
        'message' => 'Error retrieving users: ' . $e->getMessage(),
    ]);
}
?>