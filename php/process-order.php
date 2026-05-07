<?php
/**
 * PowerFit Supplements — Procesimi i Porosisë pas Pagesës
 *
 * Kjo endpoint thirret pasi Stripe konfirmon pagesën me sukses.
 * Ruan porosinë në bazën e të dhënave (opsionale) dhe dërgon email konfirmimi.
 *
 * Metoda: POST
 * Body (JSON): { payment_intent_id, customer, items, totals }
 */

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Metoda e kërkesës nuk lejohet.', 405);
}

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);

if (json_last_error() !== JSON_ERROR_NONE || empty($data)) {
    sendError('Të dhënat JSON nuk janë të vlefshme.', 400);
}

/* Valido të dhënat e detyrueshme */
$required = ['payment_intent_id', 'customer', 'items'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        sendError("Fusha '{$field}' mungon.", 400);
    }
}

$paymentIntentId = sanitizeInput($data['payment_intent_id']);
$customer = $data['customer'];
$items = $data['items'];

/* Valido PaymentIntent me Stripe */
try {
    if (class_exists('\Stripe\PaymentIntent')) {
        $paymentIntent = \Stripe\PaymentIntent::retrieve($paymentIntentId);
        if ($paymentIntent->status !== 'succeeded') {
            sendError('Pagesa nuk u konfirmua nga Stripe.', 402);
        }
    }
} catch (Exception $e) {
    sendError('Nuk mund të konfirmohet pagesa: ' . $e->getMessage(), 500);
}

/* Gjenero numrin e porosisë */
$orderNumber = 'PF-' . strtoupper(uniqid());
$timestamp = date('Y-m-d H:i:s');

/* Llogarit totalin */
$subtotal = array_sum(array_map(fn($item) => $item['price'] * $item['qty'], $items));
$shipping = $subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
$total = $subtotal + $shipping;

/* Ruan në DB (opsionale — hapi opsional) */
$dbSaved = false;
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );

    $stmt = $pdo->prepare("
        INSERT INTO orders
        (order_number, payment_intent_id, customer_name, customer_email, customer_phone,
         shipping_address, items_json, subtotal, shipping, total, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'paid', ?)
    ");
    $stmt->execute([
        $orderNumber,
        $paymentIntentId,
        sanitizeInput($customer['name'] ?? ''),
        sanitizeInput($customer['email'] ?? ''),
        sanitizeInput($customer['phone'] ?? ''),
        sanitizeInput($customer['address'] ?? ''),
        json_encode($items, JSON_UNESCAPED_UNICODE),
        $subtotal,
        $shipping,
        $total,
        $timestamp,
    ]);
    $dbSaved = true;
} catch (PDOException $e) {
    /* DB jo e detyrueshme — vazhdo pa DB */
    error_log('PowerFit DB Error: ' . $e->getMessage());
}

/* Dërgon email konfirmimi (opsionale) */
$emailSent = false;
$customerEmail = sanitizeInput($customer['email'] ?? '');
if ($customerEmail && validateEmail($customerEmail)) {
    $subject = "✅ Konfirmimi i Porosisë #{$orderNumber} — " . APP_NAME;
    $itemsList = implode("\n", array_map(
        fn($i) => "  • {$i['name']} x{$i['qty']} — " . CURRENCY_SYMBOL . number_format($i['price'] * $i['qty'], 2),
        $items
    ));
    $message = "Pershendetje {$customer['name']},\n\n"
        . "Faleminderit per porosine tuaj ne " . APP_NAME . "!\n\n"
        . "Numri i porosise: #{$orderNumber}\n"
        . "Data: {$timestamp}\n\n"
        . "Produktet:\n{$itemsList}\n\n"
        . "Nentotali: " . CURRENCY_SYMBOL . number_format($subtotal, 2) . "\n"
        . "Shperndarje: " . ($shipping > 0 ? CURRENCY_SYMBOL . number_format($shipping, 2) : 'Falas') . "\n"
        . "Totali: " . CURRENCY_SYMBOL . number_format($total, 2) . "\n\n"
        . "Produktet tuaja do te dergohen brenda 2-3 diteve pune.\n\n"
        . "Faleminderit,\n" . APP_NAME;

    $headers = "From: " . APP_NAME . " <" . ADMIN_EMAIL . ">\r\n"
        . "Reply-To: " . ADMIN_EMAIL . "\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n";

    $emailSent = mail($customerEmail, $subject, $message, $headers);
}

/* Kthen përgjigjen */
sendJson([
    'success'      => true,
    'order_number' => $orderNumber,
    'message'      => 'Porosia u procesua me sukses!',
    'db_saved'     => $dbSaved,
    'email_sent'   => $emailSent,
    'totals'       => [
        'subtotal' => $subtotal,
        'shipping' => $shipping,
        'total'    => $total,
    ],
]);
