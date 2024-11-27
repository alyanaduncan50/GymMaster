<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Make sure to include PHPMailer autoloader

function sendEmail($to, $subject, $message)
{
    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com'; 
        $mail->SMTPAuth = true;
        $mail->Username = 'uwimonagymmaster@gmail.com'; // Replace with your Gmail
        $mail->Password = 'uwulxtkynagqgvdw';  // Use Gmail App Password (Not your Gmail password)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        //Recipients
        $mail->setFrom('uwimonagymmaster@gmail.com', 'Gym Master');
        $mail->addAddress($to); // Add recipient

        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $message;

        // Send email           
        if ($mail->send()) {
            return true; // Email sent successfully
        } else {
            return false; // Email failed to send
        }    
    } catch (Exception $e) {       
        $errorMessage = "Message could not be sent. Mailer Error: {$mail->ErrorInfo}\n";
        $errorMessage .= "Exception: {$e->getMessage()}\n";
        $errorMessage .= "Date: " . date('Y-m-d H:i:s') . "\n\n";

        $logDir = __DIR__ . '/log';
        // Ensure the directory exists
        if (!is_dir($logDir)) {
            mkdir($logDir, 0755, true); // Create the 'log' directory with appropriate permissions
        }
        $logFile = $logDir . '/email_errors.log';
        error_log($errorMessage, 3,  $logFile);

        return false; 
    }
}
?>
