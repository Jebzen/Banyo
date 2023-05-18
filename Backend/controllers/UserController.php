<?php
class UserController{
  public function getAllusers(){
    // Fetch all users from the database
    $db = getDbConnection();
    $stmt = $db->prepare('SELECT user_id, username, email, created_at, updated_at FROM users');
    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the users as a JSON response
    jsonResponse($users);
  }
}