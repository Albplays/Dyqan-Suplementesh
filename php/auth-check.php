<?php
session_start();
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth-config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Metoda jo e vlefshme', 405);
}

$user = currentUser();
sendJson([
    'logged_in' => $user !== null,
    'user'      => $user,
]);
