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
      $data = new tokenizer($user['user_id'], $user['username'], $user['email']);
      jsonResponse(encodeJws($data));
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

    //Save the dateTime now
    $dateTime = new DateTime("now");
    $dateTimeFormatted = $dateTime->format('Y-m-d H:i:s');

    $db = getDbConnection();

    //if user already exists
    $stmt = $db->prepare('SELECT * FROM users WHERE username = :username OR email = :email');
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $result = $stmt->execute();
    if ($result && $stmt->rowCount() > 0) {
      jsonResponse(['error' => 'User already exists'], 400);
    }
      
    // Insert the new user into the database
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
      $data = new tokenizer($user['user_id'], $user['username'], $user['email']);
      jsonResponse(encodeJws($data));
    } else {
      // Failed to insert user
      jsonResponse(['error' => 'Failed to create user'], 400);
    }
  }

  public function updateUser(){
    //Jws bearer token
    $AuthToken = identifyAuthBearer();

    //If auth bearer true!
    if(!$AuthToken[0]){
      jsonResponse(['error' => $AuthToken[1]], 400);
    }

    //Decode the token
    $TokenData = decodeJws(($AuthToken[1]));

    //If token expired
    $dateTime = new DateTime();
    if(!isset($TokenData[1]->dateTime)){
      jsonResponse(['error' => "No DateTime in token"], 400);
    }
    $tokenDateTime = new DateTime($TokenData[1]->dateTime);
    if($dateTime < $tokenDateTime){
      jsonResponse(['error' => "Token expired"], 400);
    }

    //Database connection
    $db = getDbConnection();

    //If user is correct
    $stmt = $db->prepare('SELECT * FROM users WHERE user_id = :user_id AND username = :username AND email = :email');
    $stmt->bindParam(':user_id', $TokenData[1]->user_id);
    $stmt->bindParam(':username', $TokenData[1]->username);
    $stmt->bindParam(':email', $TokenData[1]->email);
    $result = $stmt->execute();
    if (!$result || $stmt->rowCount() < 1) {
      jsonResponse(['error' => 'User not verified'], 400);
    }

    // Retrieve the request payload
    $requestData = json_decode(file_get_contents('php://input'), true);
    
    //Needs username, password and email in body
    if(!isset($requestData['username']) || !isset($requestData['password']) || !isset($requestData['email'])){
      jsonResponse(['error' => 'Username, Password or Email Not Set'], 400);
    }

    //Set variables
    $username = $requestData['username'];
    $email = $requestData['email'];
    $password = $requestData['password'];

    
    // Check if the username and email already exist on another user
    $stmt = $db->prepare('SELECT id FROM users WHERE (username = :username OR email = :email) AND NOT user_id = :user_id');
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':user_id', $TokenData[1]->user_id);
    $stmt->execute();

    // If a user with the same username or email already exists, return an error
    if ($stmt->fetch(PDO::FETCH_ASSOC)) {
      jsonResponse(['error' => 'Username or email already exists']);
    }

    //Update user prepate
    $stmt = $db->prepare('UPDATE users SET username = :username, email = :email, password = :password, updated_at = :updated_at WHERE user_id = :user_id');

    //Bind data
    $format = $dateTime->format('Y-m-d H:i:s');
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);
    $stmt->bindParam(':updated_at', $format);
    $stmt->bindParam(':user_id', $TokenData[1]->user_id);
    
    //Execute
    $result = $stmt->execute();
    
    if ($result && $stmt->rowCount() > 0) {
      $data = new tokenizer($TokenData[1]->user_id, $username, $email);
      jsonResponse(encodeJws($data));
    } else {
      jsonResponse(['error' => 'Failed to update user']);
    }
  }
}
