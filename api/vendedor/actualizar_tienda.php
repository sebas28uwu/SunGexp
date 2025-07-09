<?php
header('Content-Type: application/json');

$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'sungexp';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión a la base de datos']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$id_vendedor = intval($input['id_vendedor'] ?? 0);
$logo_url = $conn->real_escape_string($input['logo_url'] ?? '');
$nombre = $conn->real_escape_string($input['nombre'] ?? '');
$descripcion = $conn->real_escape_string($input['descripcion'] ?? '');
$contacto = $conn->real_escape_string($input['contacto'] ?? '');

if (!$id_vendedor || !$nombre) {
    echo json_encode(['success' => false, 'error' => 'Faltan campos obligatorios']);
    exit;
}

$sql = "UPDATE Tienda SET logo_url='$logo_url', nombre='$nombre', descripcion='$descripcion', contacto='$contacto' WHERE id_vendedor=$id_vendedor";
if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}
$conn->close(); 