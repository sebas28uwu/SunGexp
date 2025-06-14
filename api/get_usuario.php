<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$input = json_decode(file_get_contents('php://input'), true);
$id_usuario = intval($input['id_usuario'] ?? 0);

if (!$id_usuario) {
    echo json_encode(['error' => 'ID de usuario no recibido']);
    exit;
}

$server = 'sl-sungexp-prod-0001.database.windows.net';
$db     = 'database-sungexp';
$user   = 'adminuserdb';
$pwd    = 'Basededatos1@';

try {
    $conn = new PDO("sqlsrv:server=$server;Database=$db", $user, $pwd);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $conn->prepare("SELECT nombre, email, rol FROM dbo.Usuario WHERE id_usuario = ?");
    $stmt->execute([$id_usuario]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(['success' => true, 'usuario' => $user]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Usuario no encontrado']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => 'Error interno: ' . $e->getMessage()]);
}
?>
