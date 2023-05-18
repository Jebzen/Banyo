<?php
//From internet?
declare(strict_types=1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: *");
//header('Content-Type: application/json');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once 'vendor/autoload.php';
require_once 'config.php';
require_once 'helpers.php';

//All code starts here

//EXAMPLE OF JWS TOKEN ENCODE & DECODE
/*
$data = [
  'userName' => "Jebzen",
  'email' => "jeb.bentzen@gmail.com",
  'id' => 1,
];

$token = JWT::encode(
  $data,
  $jwsSecret,
  'HS512'
);

echo $token;

$decodedToken = JWT::decode($token, new Key($jwsSecret, "HS512"));

var_dump($decodedToken);
*/

// Define the routes and corresponding controller methods
$routes = [
  'GET' => [
    //All users
    '/users' => 'UserController@getAllUsers',
    //User by id //DEC
    '/users/{id}' => 'UserController@getUserById',
  ],
  'POST' => [
    //Create new user
    '/users' => 'UserController@createUser',
  ],
  'PUT' => [
    //Edit existing user
    '/users/{id}' => 'UserController@updateUser',
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
  $pattern = '#^' . preg_replace('/{[^\/]+}/', '([^/]+)', $route) . '$#';
  if (preg_match($pattern, $requestPath, $matches)) {
    $routeFound = true;
    break;
  }
}

var_dump($routeFound);