<?php
//From internet?
//declare(strict_types=1);

// Enable CORS
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header("Access-Control-Allow-Headers: Authorization,Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range");
header('Content-Type: application/json');

if (isset($_SERVER['HTTP_ORIGIN'])) {
  header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else{
  header("Access-Control-Allow-Origin: *");
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])){
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
  }
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])){
    header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
  }
  exit(0);
}

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once 'vendor/autoload.php';
require_once 'config.php';
require_once 'helpers.php';

//All code starts here

// Define the routes and corresponding controller methods
$routes = [
  'GET' => [
    //All users
    '/users' => 'UserController@getAllUsers',
    //All user details from JWS
    '/user' => 'UserController@getUser',
  ],
  'POST' => [
    //Create new user
    '/users/create' => 'UserController@createUser',
    //Login with user
    '/users/login' => 'UserController@getUserLogin',
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

try{
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
} catch(Exception $e){
  jsonResponse(['error' => 'Method not found'], 404);
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