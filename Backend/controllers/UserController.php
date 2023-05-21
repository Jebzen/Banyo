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
    if(!isset($requestData['username']) || !isset($requestData['password'])){
      jsonResponse(['error' => 'Username or Password invalid'], 400);
    }

    //set easy variables
    $username = $requestData['username'];
    $password = hashPassword($requestData['password']);
    
    //Search db for user & password
    $db = getDbConnection();
    $stmt = $db->prepare('SELECT user_id, username, email FROM users WHERE username = :username AND password = :password');
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':password', $password);

    //Execute and fetch
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // If the user is found, return it as a JSON response
    if ($user) {
      $data = new tokenizer($user['user_id']);
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
    if(!isset($requestData['username']) || !isset($requestData['password']) || !isset($requestData['email'])){
      // Return a Error response
      jsonResponse(['error' => 'Username, Password or Email not send'], 400);
    }
    $username = $requestData['username'];
    $password = hashPassword($requestData['password']);
    $email = $requestData['email'];

    //Save the dateTime now
    $dateTime = new DateTime("now");
    $dateTimeFormatted = $dateTime->format('Y-m-d H:i:s');

    $db = getDbConnection();

    //if user already exists
    $stmt = $db->prepare('SELECT * FROM users WHERE username = :username OR email = :email');

    //Bind data
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);

    //Execute and check
    $result = $stmt->execute();
    if ($result && $stmt->rowCount() > 0) {
      jsonResponse(['error' => 'Username or email already exists'], 400);
    }
      
    // Insert the new user into the database
    $stmt = $db->prepare('INSERT INTO users (username, email, password, created_at, updated_at) VALUES (:username, :email, :password, :created_at, :updated_at)');

    //Bind data
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);
    $stmt->bindParam(':created_at', $dateTimeFormatted);
    $stmt->bindParam(':updated_at', $dateTimeFormatted);

    //Execute and check If inserted
    $result = $stmt->execute();
    if ($result && $stmt->rowCount() > 0) {
      // User inserted successfully

      //Make token from id and return token
      $data = new tokenizer($db->lastInsertId());
      jsonResponse(['message'=>'User created successfully','token'=>encodeJws($data)]);
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
    if($tokenDateTime < $dateTime){
      jsonResponse(['error' => "Token expired"], 400);
    }

    //Database connection
    $db = getDbConnection();

    // Retrieve the request payload
    $requestData = json_decode(file_get_contents('php://input'), true);
    
    //Needs username, password and email in body
    if(!isset($requestData['username']) || !isset($requestData['password']) || !isset($requestData['email'])){
      jsonResponse(['error' => 'Username, Password or Email Not Set'], 400);
    }

    //Set variables
    $username = $requestData['username'];
    $email = $requestData['email'];
    $password = hashPassword($requestData['password']);
    
    // Check if the username and email already exist on another user
    $stmt = $db->prepare('SELECT user_id FROM users WHERE (username = :username OR email = :email) AND NOT user_id = :user_id');
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':user_id', $TokenData[1]->user_id);
    $stmt->execute();

    // If a user with the same username or email already exists, return an error
    if ($stmt->fetch(PDO::FETCH_ASSOC)) {
      jsonResponse(['error' => 'Username or email already exists']);
    }

    //Update user prepare
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
      jsonResponse(['message' => 'User updated successfully']);
    } else {
      jsonResponse(['error' => 'Failed to update user']);
    }
  }

  public function deleteUser($params){
    //Needs username, password and email in body
    if(!isset($params[1])){
      jsonResponse(['error' => 'No user_id sent!'], 400);
    }
    $user_id = $params[1];

    //Jws bearer token
    $AuthToken = identifyAuthBearer();

    //If auth bearer true!
    if(!$AuthToken[0]){
      jsonResponse(['error' => $AuthToken[1]], 400);
    }

    //Decode the token
    $TokenData = decodeJws(($AuthToken[1]));

    //If token invalid
    $dateTime = new DateTime();
    if(!$TokenData[0] || !isset($TokenData[1]->dateTime)){
      jsonResponse(['error' => "Token Invalid"], 400);
    }
    $tokenDateTime = new DateTime($TokenData[1]->dateTime);

    if($tokenDateTime < $dateTime){
      jsonResponse(['error' => "Token expired"], 400);
    }

    //If not Admin
    //Hardcoded on user_id = 1
    if($TokenData[1]->user_id != "1"){
      jsonResponse(['error' => "Not authorized"], 400);
    }
    
    $db = getDbConnection();

    //Prepare, Bind & Execute
    $stmt = $db->prepare('DELETE FROM users WHERE user_id = :user_id AND NOT user_id = 1 ');
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();

    //If successfull
    if ($stmt->rowCount() > 0) {
      jsonResponse(['message' => 'User deleted successfully']);
    } else {
      jsonResponse(['error' => 'Failed to delete user']);
    }
  }
}
