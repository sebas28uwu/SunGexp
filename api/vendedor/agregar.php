<?php
header('Content-Type: application/json');

// Conexión a la base de datos (ajusta los datos de conexión según tu entorno)
$host = 'localhost';
$user = 'root';
$pass = '';
$db = 'sungexp';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'error' => 'Error de conexión a la base de datos']);
    exit;
}

// Obtener datos del POST (JSON)
$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    echo json_encode(['success' => false, 'error' => 'Datos no recibidos']);
    exit;
}

$nombre = $conn->real_escape_string($input['nombre'] ?? '');
$descripcion = $conn->real_escape_string($input['descripcion'] ?? '');
$precio = floatval($input['precio'] ?? 0);
$stock = intval($input['stock'] ?? 0);
$marca = $conn->real_escape_string($input['marca'] ?? '');
$imagen_url = $conn->real_escape_string($input['imagen_url'] ?? '');
$categoria = $conn->real_escape_string($input['categoria'] ?? '');
$descuento = intval($input['descuento'] ?? 0);

if (!$nombre || !$descripcion || !$precio || !$stock) {
    echo json_encode(['success' => false, 'error' => 'Faltan campos obligatorios']);
    exit;
}

$sql = "INSERT INTO Producto (nombre, descripcion, precio, stock, marca, imagen_url, categoria, descuento) VALUES ('$nombre', '$descripcion', $precio, $stock, '$marca', '$imagen_url', '$categoria', $descuento)";

if ($conn->query($sql)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}
$conn->close(); 