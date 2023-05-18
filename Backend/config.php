<?php

//ENV variables from vlucas/Dotenv
use Dotenv\Dotenv;
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Database configuration
$dbHost = $_ENV["DB_HOST"];
$dbName = $_ENV["DB_NAME"];
$dbUser = $_ENV["DB_USER"];
$dbPass = $_ENV["DB_PASS"];
$jwsSecret = $_ENV["JWS_SECRET"];

//Timezone
date_default_timezone_set('Europe/Copenhagen');

