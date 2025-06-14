<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$input = json_decode(file_get_contents('php://input'), true);
$id_usuario = intval($input['id_usuario'] ?? 0);

if (!$id_usuario) {
    echo json_encode(['success' => false, 'error' => 'ID de usuario no recibido']);
    exit;
}

$server = 'sl-sungexp-prod-0001.database.windows.net';
$db     = 'database-sungexp';
$user   = 'adminuserdb';
$pwd    = 'Basededatos1@';

try {
    $conn = new PDO("sqlsrv:server=$server;Database=$db", $user, $pwd);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("
        SELECT u.nombre, u.email, v.empresa, v.tienda, v.ruc
        FROM dbo.Usuario u
        LEFT JOIN dbo.Vendedor v ON u.id_usuario = v.id_usuario
        WHERE u.id_usuario = ?
    ");
    $stmt->execute([$id_usuario]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        echo json_encode(['success' => true, 'usuario' => $data]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Usuario/vendedor no encontrado']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Error interno: ' . $e->getMessage()]);
}
?>

