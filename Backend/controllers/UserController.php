<?php
/*
  //Params in url
  //ex Backend/users/{id}
  $id = $params[1]; 
*/

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

  public function getUserJws($params){
    // Retrieve the request body
    $requestData = json_decode(file_get_contents('php://input'), true);

    //Needs username and password in body
    try{
      if(!isset($requestData['username']) || !isset($requestData['password'])){
        // Return a Error response
        jsonResponse(['error' => 'Username or Password invalid'], 400);
      }
      $username = $requestData['username'];
      $password = $requestData['password'];
    } catch(Exception $e){
      // Return a Error response
      jsonResponse(['error' => 'Username or Password not Sent'], 400);
    }
    
    //Search db for user & password
    $db = getDbConnection();
    $stmt = $db->prepare('SELECT user_id, username, email FROM users WHERE username = :username AND password = :password');
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':password', $password);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // If the user is found, return it as a JSON response
    if ($user) {
      jsonResponse(encodeJws($user));
    } else {
      // If the user is not found, return an error response
      jsonResponse(['error' => 'Unauthorized access'], 401);
    }
  }

  private function getUserById($user_id){
    // Fetch the latest inserted record from the database
    $db = getDbConnection();
    $stmt = $db->prepare('SELECT user_id, username, email FROM users WHERE user_id = :user_id');
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  public function createUser(){
    // Retrieve the request payload
    $requestData = json_decode(file_get_contents('php://input'), true);

    //Needs username, password and email in body
    try{
      if(!isset($requestData['username']) || !isset($requestData['password']) || !isset($requestData['email'])){
        // Return a Error response
        jsonResponse(['error' => 'Username, Password or Email invalid'], 400);
      }
      $username = $requestData['username'];
      $password = $requestData['password'];
      $email = $requestData['email'];
    } catch(Exception $e){
      // Return a Error response
      jsonResponse(['error' => 'Username, Password or Email not Sent'], 400);
    }

    $dateTime = new DateTime("now");
    $dateTimeFormatted = $dateTime->format('Y-m-d H:i:s');

    //if user already exists
      
    // Insert the new user into the database
    $db = getDbConnection();
    $stmt = $db->prepare('INSERT INTO users (username, email, password, created_at, updated_at) VALUES (:username, :email, :password, :created_at, :updated_at)');
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);
    $stmt->bindParam(':created_at', $dateTimeFormatted);
    $stmt->bindParam(':updated_at', $dateTimeFormatted);
    $result = $stmt->execute();

    //If inserted
    if ($result && $stmt->rowCount() > 0) {
      // User inserted successfully
      $user = $this->getUserById($db->lastInsertId());
      jsonResponse(encodeJws($user));
    } else {
      // Failed to insert user
      jsonResponse(['error' => 'Failed to create user'], 400);
    }
  }
}
