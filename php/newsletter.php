<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Metoda e kërkesës nuk lejohet.', 405);
}

$data = json_decode(file_get_contents('php://input'), true);
$email = isset($data['email']) ? sanitizeInput($data['email']) : '';

if (empty($email) || !validateEmail($email)) {
    sendError('Email-i nuk është i vlefshëm.', 400);
}

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    /* Kontrollo nëse email ekziston */
    $check = $pdo->prepare("SELECT id FROM newsletter_subscribers WHERE email = ?");
    $check->execute([$email]);

    if ($check->fetch()) {
        sendJson(['success' => true, 'message' => 'Ky email është regjistruar tashmë!']);
    }

    $stmt = $pdo->prepare("INSERT INTO newsletter_subscribers (email) VALUES (?)");
    $stmt->execute([$email]);

    sendJson(['success' => true, 'message' => 'U regjistruat me sukses!']);

} catch (PDOException $e) {
    sendError('Gabim i bazës së të dhënave.', 500);
}
