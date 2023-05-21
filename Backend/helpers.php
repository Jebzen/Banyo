<?php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Function to send a JSON response with the specified status code
function jsonResponse($data, $statusCode = 200) {
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

//Encode JwsToken
function encodeJws($object){
  global $jwsSecret;
  
  $data = (array)$object;

  $token = JWT::encode(
    $data,
    $jwsSecret,
    'HS512'
  );

  return $token;
}

//Decode JwsToken
function decodeJws($token){
  global $jwsSecret;
  
  try{
    $decodedToken = JWT::decode($token, new Key($jwsSecret, "HS512"));
    return [true, $decodedToken];

  } catch(Exception $e){
    return [false, $e->getMessage()];
  }
}

class tokenizer{
  public $user_id;
  public $dateTime;
  function __construct($user_id) {

    //Date 1 day in the future
    $dateTime = new DateTime("+1 day");
    $dateTimeFormatted = $dateTime->format('Y-m-d H:i:s');

    //Token info:
    $this->user_id = $user_id;
    $this->dateTime = $dateTimeFormatted;
  }
}

function identifyAuthBearer(){
  try{
    $headers = getallheaders();
    
    if(!isset($headers['Authorization'])){
      throw new Error("Token not identified");
    }

    $Authorization = explode(" ",$headers['Authorization']);

    if(!isset($Authorization) || $Authorization[0] != "Bearer"){
      throw new Error("Auth not bearer");
    }

    if(!isset($Authorization[1])){
      throw new Error("No token recognized");
    }

    $token = $Authorization[1];
    return [true, $token];

  } catch(Exception $e){
    return [false, $e->getMessage() | 'Token invalid'];
  }
}

function hashPassword($password){
  global $passwordHash;

  return hash('gost', $password.$passwordHash);
}