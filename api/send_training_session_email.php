<?php
session_start();
// Set the content type to JSON
header('Access-Control-Allow-Origin: *'); 
header('Content-Type: application/json');
//require_once '../connection.php';
require '../email_config.php';

$headers = apache_request_headers();
$clientToken = $headers['Authorization'] ?? '';
$clientToken = str_replace('Bearer ', '', $clientToken);

if (!isset($_SESSION['token']) || $clientToken !== $_SESSION['token']) {
    http_response_code(401);   
    $response = [
        'success' => false,
        'message' => 'Unauthorized: Invalid or missing token.',       
    ];
    echo json_encode($response);
    exit;
}

// Get user data from the session (assuming the user info is stored in the session)
$userName = $_SESSION['user']['username'];
$to = $_SESSION['user']['email']; 

// Get the data from the request
$requestData = json_decode(file_get_contents('php://input'), true);
$date = $requestData['date'];
$time = $requestData['time'];

// Load the email template
$templatePath = __DIR__ . '/../email/training_session_template.html';

if (file_exists($templatePath)) {
    $emailTemplate = file_get_contents($templatePath);

    // Replace placeholders in the email template
    $emailMessage = str_replace(
        ['{{userName}}', '{{date}}', '{{time}}'],
        [$userName, $date, $time],
        $emailTemplate
    );

    // Send the email to the user
    $subject = "Your Training Session Confirmation";
    $sendSuccess = sendEmail($to, $subject, $emailMessage); 
    $message = $sendSuccess ? "Email sent successfully" : "but failed to send email";
   
    echo json_encode(['success' => true, 'message' => $message]);
   
} else {
    echo json_encode(['success' => false, 'message' => 'Error: Email template not found.']);
}

?>
