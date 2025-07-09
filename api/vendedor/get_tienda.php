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

if (!$id_vendedor) {
    echo json_encode(['success' => false, 'error' => 'ID de vendedor no recibido']);
    exit;
}

$sql = "SELECT logo_url, nombre, descripcion, contacto FROM Tienda WHERE id_vendedor = $id_vendedor LIMIT 1";
$result = $conn->query($sql);
if ($result && $row = $result->fetch_assoc()) {
    echo json_encode(['success' => true, 'tienda' => $row]);
} else {
    echo json_encode(['success' => false, 'error' => 'Tienda no encontrada']);
}
$conn->close(); 