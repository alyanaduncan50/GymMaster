<?php
ini_set('display_errors', 0);
error_reporting(0);
session_start();
require '../connection.php'; // Include database connection
require '../email_config.php'; // Include email configuration

header('Content-Type: application/json');

$response = [
    'success' => false,
    'message' => '',
];

// Validate the token
$headers = apache_request_headers();
$clientToken = $headers['Authorization'] ?? '';
$clientToken = str_replace('Bearer ', '', $clientToken);

if (!isset($_SESSION['token']) || $clientToken !== $_SESSION['token']) {
    http_response_code(401);
    $response['message'] = 'Unauthorized: Invalid or missing token.';
    echo json_encode($response);
    exit;
}

try {
    // Retrieve and validate input data
    $data = json_decode(file_get_contents('php://input'), true);

    $firstName = trim($data['firstName'] ?? '');
    $lastName = trim($data['lastName'] ?? '');
    $email = trim($data['email'] ?? '');
    $newUsername = trim($data['newUsername'] ?? '');
    $newPassword = trim($data['newPassword'] ?? '');
    $confirmPassword = trim($data['confirmPassword'] ?? '');
    $membershipType = trim($data['membershipType'] ?? '');

    // Input validation
    if (!$firstName || !$lastName || !$email || !$newUsername || !$newPassword || !$confirmPassword || !$membershipType) {
        $response['message'] = 'All fields are required.';
        echo json_encode($response);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Invalid email address.';
        echo json_encode($response);
        exit;
    }

    if ($newPassword !== $confirmPassword) {
        $response['message'] = 'Passwords do not match.';
        echo json_encode($response);
        exit;
    }

    if (strlen($newPassword) < 6) {
        $response['message'] = 'Password must be at least 6 characters long.';
        echo json_encode($response);
        exit;
    }

    // Check if username or email already exists
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = :username OR email = :email");
    $stmt->execute(['username' => $newUsername, 'email' => $email]);
    if ($stmt->fetchColumn() > 0) {
        $response['message'] = 'Username or email already exists.';
        echo json_encode($response);
        exit;
    }

    // Hash the password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Generate random referral code
    $referralCode = strtoupper(bin2hex(random_bytes(4)));

    // Insert user into the database
    $stmt = $pdo->prepare("
        INSERT INTO users (first_name, last_name, email, username, password, membership_type, last_renewed, referral_code) 
        VALUES (:first_name, :last_name, :email, :username, :password, :membership_type, :last_renewed, :referral_code)
    ");
    $stmt->execute([
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => $email,
        'username' => $newUsername,
        'password' => $hashedPassword,
        'membership_type' => $membershipType,
        'last_renewed' => date('Y-m-d H:i:s'),
        'referral_code' => $referralCode,
    ]);

    $lastUserId = $pdo->lastInsertId();
    $stmt = $pdo->prepare("SELECT id, first_name, last_name, email, username, membership_type, referral_code, last_renewed FROM users WHERE id = :id");
    $stmt->execute(['id' => $lastUserId]);
    $newUser = $stmt->fetch(PDO::FETCH_ASSOC);

    // Send email to the user
    $subject = "Welcome to Our Service!";
    $templatePath = __DIR__ . '/../email/welcome_email_template.html';
    $emailTemplate = file_get_contents($templatePath);
    
    $emailMessage = str_replace(
        ['{{firstName}}', '{{lastName}}', '{{newUsername}}', '{{newPassword}}', '{{referralCode}}'],
        [$firstName, $lastName, $newUsername, $newPassword, $referralCode],
        $emailTemplate
    );
    

    $is_sent = sendEmail($email, $subject, $emailMessage);
    $message = $is_sent ? "User registered successfully, and email sent." : "User registered successfully, problem sending email";
    //$mesaage = $is_sent??"User registered successfully, and email sent."||"User registered successfully, problem sending email";

    $response['success'] = true;
    $response['newUser'] = $newUser;
    $response['message'] = $message;
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
}

echo json_encode($response);
?>
