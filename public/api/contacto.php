<?php
/**
 * Kensington Academy — receptor de formularios (Agendar visita y Suscripción).
 * Compatible con el hosting compartido de Hostinger (PHP 8+, función mail()).
 *
 * CONFIGURACIÓN: cambia los correos de abajo si es necesario (destinatario y copias).
 * Recomendado: crea en hPanel el buzón no-reply@kacademy.com.mx para mejorar la entrega.
 */
declare(strict_types=1);

const TO_EMAIL   = 'kensingtonescucha@gmail.com';
// Copias de cada envío (separadas por comas)
const CC_EMAILS  = 'programacionmkt@mediamaster.mx, traffickermkt@mediamaster.mx, gerenciamkt@mediamaster.mx';
const FROM_EMAIL = 'no-reply@kacademy.com.mx';
const FROM_NAME  = 'Sitio web Kensington Academy';

header('Content-Type: application/json; charset=utf-8');
header('X-Robots-Tag: noindex');

function respond(int $code, bool $ok, string $msg = ''): void {
    http_response_code($code);
    echo json_encode(['ok' => $ok, 'message' => $msg], JSON_UNESCAPED_UNICODE);
    exit;
}
function field(string $key, int $max = 500): string {
    $v = isset($_POST[$key]) ? (string) $_POST[$key] : '';
    $v = trim(str_replace(["\r", "\0"], '', $v));
    return mb_substr($v, 0, $max);
}
function oneLine(string $v): string { return trim(preg_replace('/\s+/', ' ', $v) ?? ''); }

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') respond(405, false, 'Method not allowed');

// Anti-spam: campo trampa (honeypot) que las personas no ven.
if (field('website') !== '') respond(200, true);

// Límite básico: 1 envío cada 20 segundos por IP.
$ip = $_SERVER['REMOTE_ADDR'] ?? '0';
$lock = sys_get_temp_dir() . '/kens_' . md5($ip);
if (is_file($lock) && (time() - (int) filemtime($lock)) < 20) respond(429, false, 'Too many requests');
@touch($lock);

$type  = field('type', 20) === 'subscribe' ? 'subscribe' : 'visit';
$lang  = field('lang', 2) === 'en' ? 'en' : 'es';
$email = filter_var(field('email', 160), FILTER_VALIDATE_EMAIL);
if (!$email) respond(422, false, 'Invalid email');

if ($type === 'subscribe') {
    $subject = 'Nueva suscripción al boletín';
    $body = "Nueva suscripción desde el sitio web.\n\nCorreo: {$email}\nIdioma: {$lang}\nFecha: " . date('Y-m-d H:i');
} else {
    $name    = oneLine(field('name', 120));
    $phone   = oneLine(field('phone', 30));
    $level   = oneLine(field('level', 40));
    $age     = oneLine(field('age', 40));
    $message = field('message', 2000);
    if ($name === '' || $phone === '' || field('privacy', 5) === '') respond(422, false, 'Missing fields');
    $subject = "Solicitud de visita: {$name} ({$level})";
    $body = "Nueva solicitud para agendar visita.\n\n"
          . "Nombre: {$name}\nCorreo: {$email}\nTeléfono: {$phone}\nNivel de interés: {$level}\n"
          . "Edad del hijo(a): {$age}\nIdioma del sitio: {$lang}\n\nMensaje:\n{$message}\n\n"
          . "Aceptó el aviso de privacidad: sí\nFecha: " . date('Y-m-d H:i');
}

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'From: =?UTF-8?B?' . base64_encode(FROM_NAME) . '?= <' . FROM_EMAIL . '>',
    'Cc: ' . CC_EMAILS,
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . PHP_VERSION,
];
$sent = mail(TO_EMAIL, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, implode("\r\n", $headers), '-f' . FROM_EMAIL);

$sent ? respond(200, true) : respond(500, false, 'Mail error');
