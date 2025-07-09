<?php
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['success' => false, 'error' => 'Datos no recibidos']);
    exit;
}

$nombre = trim($input['nombre'] ?? '');
$descripcion = trim($input['descripcion'] ?? '');
$precio = floatval($input['precio'] ?? 0);
$stock = intval($input['stock'] ?? 0);
$marca = trim($input['marca'] ?? '');
$imagen_url = trim($input['imagen_url'] ?? '');
$categoria = trim($input['categoria'] ?? '');
$descuento = intval($input['descuento'] ?? 0);

if (!$nombre || !$descripcion || !$precio || !$stock) {
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
    $stmt = $conn->prepare("INSERT INTO dbo.Producto (nombre, descripcion, precio, stock, marca, imagen_url, categoria, descuento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$nombre, $descripcion, $precio, $stock, $marca, $imagen_url, $categoria, $descuento]);
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
} 