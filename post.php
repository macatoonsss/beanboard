<?php
session_start();
include 'db.php';

// Redirect if not logged in
if (!isset($_SESSION['user_id'])) {
    header("Location: index.php");
    exit;
}

if (isset($_POST['post'])) {

    $poster = $_SESSION['user_id']; // Safe now
    $caption = trim($_POST['caption']); // Optional: sanitize

    $imageName = null;

    // Handle image upload
    if (!empty($_FILES['image']['name'])) {

        // Ensure uploads folder exists
        if (!file_exists('Images')) {
            mkdir('Images', 0777, true);
        }

        // Create unique filename
        $imageName = time() . "_" . basename($_FILES['image']['name']);
        $target = "Images/" . $imageName;

        // Move uploaded file
        if (!move_uploaded_file($_FILES['image']['tmp_name'], $target)) {
            echo "Error uploading image!";
            exit;
        }
    }

    // Insert post into database
    $stmt = $mysqli->prepare("INSERT INTO posts (poster, caption, image) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $poster, $caption, $imageName);

    if ($stmt->execute()) {
        // Success, redirect back to home
        header("Location: main.php");
        exit;
    } else {
        echo "Error: " . $stmt->error;
    }
}
?>