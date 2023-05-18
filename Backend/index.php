<?php
//From internet?
declare(strict_types=1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: *");

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

require_once 'vendor/autoload.php';
require_once 'config.php';
require_once 'helpers.php';

//All code starts here

//EXAMPLE OF JWS TOKEN ENCODE & DECODE

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