<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$server = 'tcp:sl-sungexp-prod-0001.database.windows.net,1433';
$database = 'database-sungexp';
$username = 'adminuserdb@sl-sungexp-prod-0001';
$password = 'Basededatos1@';

try {
    $conn = new PDO("sqlsrv:Server=$server;Database=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recibe JSON POST
    $data = json_decode(file_get_contents('php://input'), true);
    $id_cliente = $data['id_cliente'];
    $total = $data['total'];

    $stmt = $conn->prepare("INSERT INTO Orden (id_cliente, total, estado) VALUES (?, ?, 'pendiente')");
    $stmt->execute([$id_cliente, $total]);

    echo json_encode(["message" => "Orden agregada correctamente"]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
