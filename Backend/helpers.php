<?php
// Function to send a JSON response with the specified status code
function jsonResponse($data, $statusCode = 200) {
  header('Content-Type: application/json');
  http_response_code($statusCode);
  echo json_encode($data);
  exit();
}

// Function to establish a database connection
function getDbConnection() {
  global $dbHost, $dbName, $dbUser, $dbPass;

  try {
    $db = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $db;
  } catch (PDOException $e) {
    jsonResponse(['error' => 'Database connection failed'], 500);
  }
}