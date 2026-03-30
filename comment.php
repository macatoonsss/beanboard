<?php
session_start();
include 'db.php';

// Make sure user is logged in
if (!isset($_SESSION['user_id'])) {
    exit("Unauthorized");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $user_id = $_SESSION['user_id'];
    $post_id = isset($_POST['post_id']) ? intval($_POST['post_id']) : 0;
    $comment = isset($_POST['comment']) ? trim($_POST['comment']) : '';

    if (!empty($comment) && $post_id > 0) {

        $stmt = $mysqli->prepare("INSERT INTO comments (commentor, post, comment) VALUES (?, ?, ?)");
        $stmt->bind_param("iis", $user_id, $post_id, $comment);
        $stmt->execute();
        $stmt->close();
    }
}

// Redirect back to previous page
header("Location: " . $_SERVER['HTTP_REFERER']);
exit;
?>