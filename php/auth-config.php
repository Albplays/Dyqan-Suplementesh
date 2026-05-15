<?php
/**
 * PowerFit Supplements — Auth Helpers
 * Kërkon config.php të jetë i ngarkuar para kësaj.
 */

function getDB(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;
    try {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    } catch (PDOException $e) {
        sendError('Gabim me bazën e të dhënave', 500);
    }
    return $pdo;
}

function currentUser(): ?array {
    return $_SESSION['powerfit_user'] ?? null;
}
