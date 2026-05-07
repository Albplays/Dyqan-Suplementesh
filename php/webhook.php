<?php
/**
 * PowerFit Supplements — Stripe Webhook Handler
 *
 * Konfiguro këtë URL në Stripe Dashboard:
 * https://dashboard.stripe.com/webhooks
 * → Add endpoint → URL: https://yourdomain.com/php/webhook.php
 * → Events: payment_intent.succeeded, payment_intent.payment_failed
 */

require_once 'config.php';

/* Merr payload dhe signature nga Stripe */
$payload   = file_get_contents('php://input');
$sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

if (empty($payload) || empty($sigHeader)) {
    http_response_code(400);
    exit('Payload ose signature mungon.');
}

/* Verifiko signature */
try {
    if (!class_exists('\Stripe\Webhook')) {
        throw new Exception('Libraria Stripe nuk është instaluar.');
    }
    $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, STRIPE_WEBHOOK_SECRET);
} catch (\Stripe\Exception\SignatureVerificationException $e) {
    http_response_code(400);
    exit('Signature e pavlefshme.');
} catch (Exception $e) {
    http_response_code(500);
    exit('Gabim: ' . $e->getMessage());
}

/* Trajto ngjarjet */
switch ($event->type) {
    case 'payment_intent.succeeded':
        $paymentIntent = $event->data->object;
        $orderId = $paymentIntent->metadata->order_id ?? 'N/A';
        error_log("PowerFit: Pagesa u krye me sukses — PaymentIntent {$paymentIntent->id}, Porosi #{$orderId}");

        /* Këtu mund të: */
        /* 1. Përditëso statusin e porosisë në DB */
        /* 2. Dërgo email konfirmimi */
        /* 3. Njofto adminin */
        break;

    case 'payment_intent.payment_failed':
        $paymentIntent = $event->data->object;
        $failureMsg = $paymentIntent->last_payment_error->message ?? 'Arsye e panjohur';
        error_log("PowerFit: Pagesa dështoi — PaymentIntent {$paymentIntent->id}: {$failureMsg}");
        break;

    case 'charge.refunded':
        $charge = $event->data->object;
        error_log("PowerFit: Rimbursim — Charge {$charge->id}");
        break;

    default:
        /* Ngjarjet e tjera injorohen */
}

http_response_code(200);
echo json_encode(['received' => true]);
