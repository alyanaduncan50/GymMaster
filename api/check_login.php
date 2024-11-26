<?php
session_start();
require '../connection.php'; // Include database connection
require '../config.php';

header('Content-Type: application/json');

$response = [
    'success' => false,
    'message' => '',
    'redirect_url' => '',
];

try {
    $input = json_decode(file_get_contents('php://input'), true);

    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');

    if (!$username || !$password) {
        $response['message'] = 'Username and password are required.';
        echo json_encode($response);
        exit;
    }

    // Fetch user from database
    $stmt = $pdo->prepare("SELECT id, username, password FROM users WHERE username = :username");
    $stmt->execute(['username' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user || !password_verify($password, $user['password'])) {
        $response['message'] = 'Invalid username or password.';
        echo json_encode($response);
        exit;
    }

    // Set session and determine redirect URL
    $_SESSION['user'] = $user;
    $response['success'] = true;
    $response['redirect_url'] = BASE_URL . (($user['username'] === 'admin') ? '/admin.html' : '/user.html');
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

echo json_encode($response);
?>
