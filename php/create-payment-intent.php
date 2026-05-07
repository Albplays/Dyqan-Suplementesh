<?php
/**
 * PowerFit Supplements — Krijo Stripe Payment Intent
 * Kjo endpoint krijon një PaymentIntent nga Stripe API.
 *
 * Metoda: POST
 * Body (JSON): { amount: number, currency: string, customer: object }
 */

require_once 'config.php';

/* Prano vetëm POST */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Metoda e kërkesës nuk lejohet. Përdor POST.', 405);
}

/* Lexo dhe valido të dhënat hyrëse */
$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);

if (json_last_error() !== JSON_ERROR_NONE || empty($data)) {
    sendError('Të dhënat e dërguara nuk janë JSON valid.', 400);
}

/* Valido shumën */
$amount = isset($data['amount']) ? (int) round($data['amount'] * 100) : 0;
if ($amount < 50) { /* Minimumi €0.50 */
    sendError('Shuma duhet të jetë të paktën €0.50.', 400);
}
if ($amount > 999999) { /* Maksimumi €9999.99 */
    sendError('Shuma kalon limitin maksimal të lejuar.', 400);
}

/* Valido currency */
$allowedCurrencies = ['eur', 'usd', 'gbp', 'all'];
$currency = isset($data['currency']) ? strtolower(sanitizeInput($data['currency'])) : 'eur';
if (!in_array($currency, $allowedCurrencies)) {
    sendError('Monedha e zgjedhur nuk është e lejuar.', 400);
}

/* Valido email të klientit */
$customerEmail = isset($data['customer']['email']) ? sanitizeInput($data['customer']['email']) : '';
if (!empty($customerEmail) && !validateEmail($customerEmail)) {
    sendError('Email-i i klientit nuk është i vlefshëm.', 400);
}

/* Merr informacionin e porosisë */
$customerName = isset($data['customer']['name']) ? sanitizeInput($data['customer']['name']) : 'Klient';
$orderItems = isset($data['items']) ? $data['items'] : [];

/* Krijo PaymentIntent në Stripe */
try {
    if (!class_exists('\Stripe\PaymentIntent')) {
        sendError(
            'Libraria Stripe nuk është instaluar. Ekzekuto: composer require stripe/stripe-php',
            500
        );
    }

    $paymentIntent = \Stripe\PaymentIntent::create([
        'amount'               => $amount,
        'currency'             => $currency,
        'automatic_payment_methods' => ['enabled' => true],
        'description'          => APP_NAME . ' — Porosi Online',
        'receipt_email'        => $customerEmail ?: null,
        'metadata'             => [
            'customer_name'    => $customerName,
            'customer_email'   => $customerEmail,
            'order_items'      => json_encode($orderItems, JSON_UNESCAPED_UNICODE),
            'shipping_address' => isset($data['customer']['address'])
                ? sanitizeInput($data['customer']['address'])
                : '',
            'created_from'     => 'PowerFit Website',
        ],
        'statement_descriptor_suffix' => 'POWERFIT',
    ]);

    sendJson([
        'client_secret'    => $paymentIntent->client_secret,
        'payment_intent_id' => $paymentIntent->id,
        'amount'           => $amount,
        'currency'         => $currency,
    ]);

} catch (\Stripe\Exception\CardException $e) {
    sendError('Karta u refuzua: ' . $e->getMessage(), 402);
} catch (\Stripe\Exception\RateLimitException $e) {
    sendError('Shumë kërkesa. Provo sërish pas pak.', 429);
} catch (\Stripe\Exception\InvalidRequestException $e) {
    sendError('Kërkesë e pavlefshme: ' . $e->getMessage(), 400);
} catch (\Stripe\Exception\AuthenticationException $e) {
    sendError('Çelësi i Stripe API nuk është valid. Kontrollo config.php.', 401);
} catch (\Stripe\Exception\ApiConnectionException $e) {
    sendError('Nuk mund të lidhem me Stripe. Kontrollo lidhjen me internet.', 503);
} catch (\Stripe\Exception\ApiErrorException $e) {
    sendError('Gabim i Stripe API: ' . $e->getMessage(), 500);
} catch (Exception $e) {
    sendError('Gabim i brendshëm: ' . $e->getMessage(), 500);
}
