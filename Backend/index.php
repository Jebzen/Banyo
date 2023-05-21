<?php
//From internet?
declare(strict_types=1);

// Enable CORS
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Access-Control-Allow-Headers: *");
header('Content-Type: application/json');
//header('Content-Type: application/json');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once 'vendor/autoload.php';
require_once 'config.php';
require_once 'helpers.php';

//All code starts here

//EXAMPLE OF JWS TOKEN ENCODE & DECODE
/*
try{
  $decodedToken = JWT::decode($token, new Key("SecretKeyString", "HS512"));
  var_dump($decodedToken);
} catch(Exception $e){
  var_dump($e->getMessage());
}
*/

// Define the routes and corresponding controller methods
$routes = [
  'GET' => [
    //All users
    '/users' => 'UserController@getAllUsers',
  ],
  'POST' => [
    //Create new user
    '/users/create' => 'UserController@createUser',
    //Login with user
    '/users/login' => 'UserController@getUserJws',
  ],
  'PUT' => [
    //Edit existing user
    '/users' => 'UserController@updateUser',
  ],
  'DELETE' => [
    //Delete existing user only by admin
    '/users/{id}' => 'UserController@deleteUser',
  ],
];

// Process the request
$requestMethod = $_SERVER['REQUEST_METHOD']; //Get, Post, Put or Delete

//The actual path
//Converts /Banyo/Backend/users to /users
$requestPath = preg_replace('#\.php#','',preg_replace('#/Banyo/Backend#', '', $_SERVER['REQUEST_URI'])); 

// Find the matching route
$routeFound = false;
foreach ($routes[$requestMethod] as $route => $handler) {
  //Pattern for replacement of {something}
  $pattern = '#^' . preg_replace('/{[^\/]+}/', '([^/]+)', $route) . '$#';
  if (preg_match($pattern, $requestPath, $matches)) {
    $routeFound = true;
    break;
  }
}

if($routeFound){
  //$handler is saved from previous foreach function
  //UserController@getAllUsers = UserController & getAllUsers
  list($controllerName, $methodName) = explode('@', $handler);

  //userController to UserController always
  $controllerClassName = ucfirst($controllerName);

  //Finds the file in the system
  //ex: controllers/UserController.php
  $controllerFile = 'controllers/' . $controllerClassName . '.php';

  if (file_exists($controllerFile)) {
    //Read the controller
    require_once $controllerFile;

    //Makes a new controller from the class
    //ex: $controller = new UserController()
    $controller = new $controllerClassName();

    //Runs the targeted method
    //ex: UserController->GetAllUsers
    $controller->$methodName($matches);
  } else {
    jsonResponse(['error' => 'Controller not found'], 404);
  }
} else{
  jsonResponse(['error' => 'Route not found'], 404);
}