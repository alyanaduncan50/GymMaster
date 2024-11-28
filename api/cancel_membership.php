<?php
header('Content-Type: application/json');
// Allow CORS for local development (remove for production if unnecessary)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

require_once '../connection.php'; // Make sure to provide the correct path
require '../email_config.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['email'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid input data. Username and email are required.'
    ]);
    exit;
}

$username = $data['username'];
$to = $data['email'];

try {
    // Prepare and execute the DELETE query
    $stmt = $pdo->prepare("DELETE FROM users WHERE username = :username");
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        // Prepare email template
        $templatePath = __DIR__ . '/../email/cancel_membership_template.html';
        if (file_exists($templatePath)) {
            $emailTemplate = file_get_contents($templatePath);
            $emailMessage = str_replace('{{userName}}', $username, $emailTemplate);

            // Send cancellation email
            $subject = "Membership Cancelled";
            $is_sent = sendEmail($to, $subject, $emailMessage);

            $message = $is_sent ? 'Membership cancelled and email sent.' : 'Membership cancelled, problem sending email.';

            echo json_encode([
                'success' => true,
                'message' => $message
            ]);
        } else {
            throw new Exception("Email template file not found.");
        }
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'No user found with the provided username.'
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>
