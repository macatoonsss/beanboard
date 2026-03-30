<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Database credentials
$host = "localhost";
$user = "root";
$pass = "";
$db   = "beanboard";

// Create connection
$mysqli = new mysqli($host, $user, $pass, $db);
if ($mysqli->connect_error) {
    die("Database connection failed: " . $mysqli->connect_error);
}
?>