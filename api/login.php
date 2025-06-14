<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// 1) Leer JSON
$input  = json_decode(file_get_contents('php://input'), true);
$correo = trim($input['correo']   ?? '');
$pass   = $input['password']      ?? '';

if (!$correo || !$pass) {
    echo json_encode([
        'exito' => false,
        'error' => 'Faltan correo o contraseña.'
    ]);
    exit;
}

// 2) Conexión PDO
$server = 'sl-sungexp-prod-0001.database.windows.net';
$db     = 'database-sungexp';
$user   = 'adminuserdb';
$pwd    = 'Basededatos1@';

try {
    $conn = new PDO("sqlsrv:server=$server;Database=$db", $user, $pwd);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 3) Seleccionamos la columna [contraseña] y la aliasamos a 'hash'
    $stmt = $conn->prepare("
        SELECT
          id_usuario,
          [contraseña] AS hash,
          rol
        FROM dbo.Usuario
        WHERE email = ?
    ");
    $stmt->execute([$correo]);

    if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        // 4) Verificar hash de contraseña usando el alias
        if (password_verify($pass, $row['hash'])) {
            echo json_encode([
                'exito'   => true,
                'usuario' => [
                    'id'  => $row['id_usuario'],
                    'rol' => $row['rol']
                ]
            ]);
            exit;
        }
    }

    // 5) Credenciales inválidas
    echo json_encode([
        'exito' => false,
        'error' => 'Correo o contraseña inválidos.'
    ]);

} catch (Exception $e) {
    // 6) Error interno
    echo json_encode([
        'exito' => false,
        'error' => 'Error interno: ' . $e->getMessage()
    ]);
}
?>
