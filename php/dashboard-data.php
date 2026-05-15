<?php
session_start();
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth-config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Metoda jo e vlefshme', 405);
}

$user = currentUser();
if (!$user) {
    sendError('Jo i autorizuar — hyr në llogari', 401);
}

try {
    $db   = getDB();
    $stmt = $db->prepare(
        'SELECT order_number, total, status, created_at
         FROM orders
         WHERE customer_email = ?
         ORDER BY created_at DESC
         LIMIT 10'
    );
    $stmt->execute([$user['email']]);
    $orders = $stmt->fetchAll();

    sendJson(['orders' => $orders, 'user' => $user]);
} catch (PDOException $e) {
    sendJson(['orders' => [], 'user' => $user]);
}
