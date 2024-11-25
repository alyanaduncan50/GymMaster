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
    sendEmail($to, $subject, $emailMessage);


    echo json_encode([
        'success' => true,
        'message' => 'Membership renewed successfully.'
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
