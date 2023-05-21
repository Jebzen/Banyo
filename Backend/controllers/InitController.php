<?php
class InitController{
  public function start(){
    //Create database
    $db = getDbConnection();
    $stmt = $db->prepare('CREATE TABLE IF NOT EXISTS `users` (
      `user_id` int NOT NULL AUTO_INCREMENT,
      `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
      `email` varchar(255) NOT NULL,
      `password` varchar(255) NOT NULL,
      `created_at` datetime NOT NULL,
      `updated_at` datetime NOT NULL,
      PRIMARY KEY (`user_id`)
    ) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;');
    $stmt->execute();

    $tableExists = false;
    $tableQuery = $db->query("SHOW TABLES LIKE 'users'");
    $tableExists = $tableQuery->rowCount() > 0;

    //$this->CreateAdmin();
    if(!$tableExists){
      jsonResponse(["message"=>"Database created"]);
    } else{
      jsonResponse(["message"=>"Database already created"]);
    }
    
  }

  private function CreateAdmin(){
    $db = getDbConnection();

    $username = "ADMIN";
    $email = "admin@mail.com";
    $password = "63201f89bdd9fbad25c6a764da52a0eda74049bf902eef6612b9efee5c3a524b";
    $date = new DateTime("now");
    $dateTime = $date->format('Y-m-d H:i:s');

    $query = "SELECT 1 FROM users WHERE username = :username";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':username', $username);
    $stmt->execute();


    if ($stmt->rowCount() > 0) {
      return false;
    }

    // Insert Admin user
    $stmt = $db->prepare('INSERT INTO 
      users (username, email, password, created_at, updated_at) 
      VALUES (:username, :email, :password, :created_at, :updated_at)');

    //Bind data
    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);
    $stmt->bindParam(':created_at', $dateTime);
    $stmt->bindParam(':updated_at', $dateTime);
    $stmt->execute();

    return $stmt->rowCount() > 0;
  }
}