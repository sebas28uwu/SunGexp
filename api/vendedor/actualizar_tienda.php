<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$id_vendedor = intval($input['id_vendedor'] ?? 0);
$logo_url = trim($input['logo_url'] ?? '');
$nombre = trim($input['nombre'] ?? '');
$descripcion = trim($input['descripcion'] ?? '');
$contacto = trim($input['contacto'] ?? '');

if (!$id_vendedor || !$nombre) {
    echo json_encode(['success' => false, 'error' => 'Faltan campos obligatorios']);
    exit;
}

$server = 'sl-sungexp-prod-0001.database.windows.net';
$db     = 'database-sungexp';
$user   = 'adminuserdb';
$pwd    = 'Basededatos1@';

try {
    $conn = new PDO("sqlsrv:server=$server;Database=$db", $user, $pwd);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->prepare("UPDATE dbo.Tienda SET logo_url = ?, nombre = ?, descripcion = ?, contacto = ? WHERE id_vendedor = ?");
    $stmt->execute([$logo_url, $nombre, $descripcion, $contacto, $id_vendedor]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} 