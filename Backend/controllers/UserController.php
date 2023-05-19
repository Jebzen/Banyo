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

    // Retrieve the request payload
    $requestData = json_decode(file_get_contents('php://input'), true);

    //Needs user and password
    $username = $requestData['username'];
    $password = $requestData['password'];

    if($username == null || $password == null){
      // Return a success response
      jsonResponse(['error' => 'Username or Password no inputted'], 400);
    }
    
    //Search db for user & password
    $db = getDbConnection();
    $stmt = $db->prepare('SELECT * FROM users WHERE username = :username AND password = :password');
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':password', $password);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // If the user is found, return it as a JSON response
    if ($user) {
      $token = encodeJws($user);

      jsonResponse($token);
    } else {
      // If the user is not found, return an error response
      jsonResponse(['error' => 'Unauthorized access'], 401);
    }
  }
}