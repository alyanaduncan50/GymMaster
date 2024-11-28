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

   // Get email from the session
    $to =  $_SESSION['user']['email']; 
    $userName = $_SESSION['user']['username'];

    // Load the email template
    $templatePath = __DIR__ . '/../email/feedback_email_template.html';
    
    if (file_exists($templatePath)) {
        $emailTemplate = file_get_contents($templatePath);

        // Replace placeholders in the email template
        $emailMessage = str_replace(
            ['{{userName}}'],
            [$userName],
            $emailTemplate
        );

        // Send the email to the user
        $subject = "Feedback Submitted!";
        $sendSuccess = sendEmail($to, $subject, $emailMessage);        
        echo json_encode([
            'success' => true,
            'message' => $sendSuccess ? 'Feedback email sent successfully.' : 'Failed to send email.',
        ]);
        
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error: Email template not found.',
        ]);
    }

?>
