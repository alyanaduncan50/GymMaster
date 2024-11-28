<?php
require_once '../connection.php';
require '../email_config.php';
// Assume $pdo is your database connection
header('Content-Type: application/json');

// Get the user ID and new membership type from the request body
$data = json_decode(file_get_contents('php://input'), true);
$userName = $data['userName'];
$to = $data['email'];
$membershipType = $data['membershipType'];

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
$response = [
    'success' => false,
    'message' => ''
];

// Check if token exists
if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $response['message'] = 'Authorization token is missing or invalid.';
    echo json_encode($response);
    exit;
}

$token = $matches[1];

try {
    // Update the membership in the database (renew the membership)
    $query = "UPDATE users SET last_renewed = NOW(), membership_type = :membershipType WHERE username = :userName";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        'membershipType' => $membershipType,
        'userName' => $userName
    ]);

    // Load and process the email template
    $currentDate = date('Y-m-d');
    $templatePath = __DIR__ . '/../email/renew_membership_template.html';
    $emailTemplate = file_get_contents($templatePath);
    $emailMessage = str_replace(
        ['{{userName}}', '{{membershipType}}', '{{renewalDate}}'],
        [$userName, $membershipType, $currentDate],
        $emailTemplate
    );

    // Send the email
  
    $subject = "Membership Renewed Successfully";
    $is_sent = sendEmail($to, $subject, $emailMessage);

    $message = $is_sent ? 'Membership renewed successfully.' : 'Membership renewed successfully, problem sending email';

    echo json_encode([
        'success' => true,
        'renewalDate' => $currentDate,
        'message' => $message
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
