<?php
session_start();
require 'connection.php';
require 'config.php';

header('Content-Type: application/json');

$username = $_POST['username'] ?? '';
$password = md5($_POST['password'] ?? ''); // Hash password for matching

$response = [
    'success' => false,
    'message' => '',
    'redirect_url' => '',
];

if (!$username || !$password) {
    $response['message'] = 'Username and password are required.';
    echo json_encode($response);
    exit;
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :username AND password = :password");
$stmt->execute(['username' => $username, 'password' => $password]);
$user = $stmt->fetch();

if ($user) {
    $_SESSION['user'] = $user;
    $response['success'] = true;
    $response['redirect_url'] = BASE_URL. (($user['username'] === 'admin') ? '/admin.html' : '/user.html');
} else {
    $response['message'] = 'Invalid username or password.';
}

echo json_encode($response);
