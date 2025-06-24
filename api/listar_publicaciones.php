<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$input = json_decode(file_get_contents('php://input'), true);
$id_vendedor = intval($input['id_vendedor'] ?? 0);

if (!$id_vendedor) {
    echo json_encode(['success' => false, 'error' => 'ID de vendedor no recibido']);
    exit;
}

$server = 'sl-sungexp-prod-0001.database.windows.net';
$db     = 'database-sungexp';
$user   = 'adminuserdb';
$pwd    = 'Basededatos1@';

try {
    $conn = new PDO("sqlsrv:server=$server;Database=$db", $user, $pwd);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Selecciona las publicaciones del vendedor
    $stmt = $conn->prepare("
        SELECT nombre_producto, tipo_producto, precio, stock
        FROM dbo.Publicacion
        WHERE id_vendedor = ?
    ");
    $stmt->execute([$id_vendedor]);
    $publicaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'publicaciones' => $publicaciones]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
