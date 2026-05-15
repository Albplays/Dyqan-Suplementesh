<?php
session_start();
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth-config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Metoda jo e vlefshme', 405);
}

$data     = json_decode(file_get_contents('php://input'), true);
$email    = sanitizeInput($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
    sendError('Email-i dhe fjalëkalimi janë të detyrueshme');
}
if (!validateEmail($email)) {
    sendError('Email-i është i pavlefshëm');
}

try {
    $stmt = getDB()->prepare('SELECT id, name, email, password_hash FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        sendError('Email-i ose fjalëkalimi është i gabuar', 401);
    }

    $session = ['id' => $user['id'], 'name' => $user['name'], 'email' => $user['email']];
    $_SESSION['powerfit_user'] = $session;

    sendJson(['success' => true, 'user' => $session]);
} catch (PDOException $e) {
    sendError('Gabim i serverit', 500);
}
