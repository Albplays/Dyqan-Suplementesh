<?php
session_start();
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth-config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Metoda jo e vlefshme', 405);
}

$data     = json_decode(file_get_contents('php://input'), true);
$name     = sanitizeInput($data['name'] ?? '');
$email    = sanitizeInput($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$name || !$email || !$password) {
    sendError('Të gjitha fushat janë të detyrueshme');
}
if (mb_strlen($name) < 2) {
    sendError('Emri duhet të ketë të paktën 2 karaktere');
}
if (!validateEmail($email)) {
    sendError('Email-i është i pavlefshëm');
}
if (strlen($password) < 6) {
    sendError('Fjalëkalimi duhet të ketë të paktën 6 karaktere');
}

try {
    $db   = getDB();
    $chk  = $db->prepare('SELECT id FROM users WHERE email = ?');
    $chk->execute([$email]);
    if ($chk->fetch()) {
        sendError('Ky email është tashmë i regjistruar', 409);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    $ins  = $db->prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
    $ins->execute([$name, $email, $hash]);
    $id = (int) $db->lastInsertId();

    $session = ['id' => $id, 'name' => $name, 'email' => $email];
    $_SESSION['powerfit_user'] = $session;

    sendJson(['success' => true, 'user' => $session], 201);
} catch (PDOException $e) {
    sendError('Gabim i serverit', 500);
}
