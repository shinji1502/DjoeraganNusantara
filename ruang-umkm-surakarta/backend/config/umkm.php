<?php

return [
    // Rahasia HMAC untuk callback gateway pembayaran. Kosong = webhook nonaktif.
    'payment_webhook_secret' => env('PAYMENT_WEBHOOK_SECRET'),
];