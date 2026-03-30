<?php
session_start();
include 'db.php';

if (!isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $follower_id = $_SESSION['user_id'];
    $following_id = $_POST['following_id'];

    // Prevent self-follow
    if ($follower_id == $following_id) {
        header("Location: home.php");
        exit;
    }

    // Check if already followed
    $check = $mysqli->prepare("SELECT id FROM follows WHERE follower_id=? AND following_id=?");
    $check->bind_param("ii", $follower_id, $following_id);
    $check->execute();
    $check->store_result();

    if ($check->num_rows == 0) {
        // Insert follow
        $stmt = $mysqli->prepare("INSERT INTO follows (follower_id, following_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $follower_id, $following_id);
        $stmt->execute();
    }

    header("Location: main.php"); // reload page
    exit;
}
?>