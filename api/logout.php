<?php
session_start();

// Destroy the session to log the user out
session_unset();
session_destroy();

echo json_encode([
    'success' => true,
    'message' => 'Logged out successfully.'
]);
?>
