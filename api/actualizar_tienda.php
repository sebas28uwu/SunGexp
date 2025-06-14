<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$input = json_decode(file_get_contents('php://input'), true);

$id_usuario     = intval($input['id_usuario'] ?? 0);
$nombre_empresa = trim($input['nombre_empresa'] ?? '');
$nombre_tienda  = trim($input['nombre_tienda'] ?? '');
$ruc            = trim($input['ruc'] ?? '');

if (!$id_usuario) {
    echo json_encode(['success' => false, 'error' => 'Falta ID']);
    exit;
}

// Conexión (igual que antes)
$server = 'sl-sungexp-prod-0001.database.windows.net';
$db     = 'database-sungexp';
$user   = 'adminuserdb';
$pwd    = 'Basededatos1@';

try {
    $conn = new PDO("sqlsrv:server=$server;Database=$db", $user, $pwd);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Actualizar datos de la tienda
    $stmt = $conn->prepare("
        UPDATE dbo.Usuario
        SET nombre_empresa = ?, nombre_tienda = ?, ruc = ?
        WHERE id_usuario = ?
    ");
    $stmt->execute([$nombre_empresa, $nombre_tienda, $ruc, $id_usuario]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$input = json_decode(file_get_contents('php://input'), true);

$id_usuario     = intval($input['id_usuario'] ?? 0);
$nombre_empresa = trim($input['empresa'] ?? '');
$nombre_tienda  = trim($input['tienda'] ?? '');
$ruc            = trim($input['ruc'] ?? '');

if (!$id_usuario) {
    echo json_encode(['success' => false, 'error' => 'Falta ID']);
    exit;
}

// Conexión (igual que antes)
$server = 'sl-sungexp-prod-0001.database.windows.net';
$db     = 'database-sungexp';
$user   = 'adminuserdb';
$pwd    = 'Basededatos1@';

try {
    $conn = new PDO("sqlsrv:server=$server;Database=$db", $user, $pwd);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Actualizar datos de la tienda
    $stmt = $conn->prepare("
        UPDATE dbo.Usuario
        SET empresa = ?, tienda = ?, ruc = ?
        WHERE id_usuario = ?
    ");
    $stmt->execute([$nombre_empresa, $nombre_tienda, $ruc, $id_usuario]);

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
