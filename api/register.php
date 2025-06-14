<?php
// Le decimos al cliente que la respuesta será JSON
header('Content-Type: application/json');
// Si necesitas aceptar peticiones CORS desde otros orígenes, descomenta la siguiente línea:
// header('Access-Control-Allow-Origin: *');

// Leemos el JSON que envía el front-end
$data = json_decode(file_get_contents('php://input'), true);

// Validación básica de campos recibidos
$nombre     = trim($data['nombre']     ?? '');
$apellido   = trim($data['apellido']   ?? '');
$email      = trim($data['email']      ?? '');
$contrasena = $data['contrasena']      ?? '';
$rol        = $data['rol']             ?? '';

if (!$nombre || !$apellido || !$email || !$contrasena || !$rol) {
    echo json_encode([
      'exito' => false,
      'error' => 'Faltan campos obligatorios'
    ]);
    exit;
}

// Hasheamos la contraseña antes de almacenarla
$hash = password_hash($contrasena, PASSWORD_DEFAULT);

// ─── CONFIGURA AQUÍ TU CONEXIÓN A LA BASE DE DATOS ───
// En tu caso, Azure SQL Server. Asegura que estos datos coincidan con tu servidor:
$serverName = 'sl-sungexp-prod-0001.database.windows.net';
$database   = 'database-sungexp';
$username   = 'adminuserdb';
$password   = 'Basededatos1@';

try {
    // Conexión con PDO para SQL Server
    $conn = new PDO("sqlsrv:server=$serverName;Database=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1) Verificamos que no exista ya un usuario con el mismo correo en dbo.Usuario
    $stmt = $conn->prepare("SELECT id_usuario FROM dbo.Usuario WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo json_encode([
          'exito' => false,
          'error' => 'Correo ya registrado'
        ]);
        exit;
    }

    // 2) Insertamos el nuevo usuario en dbo.Usuario
    //    Usamos corchetes en [contraseña] porque la columna tiene tilde
    $stmt = $conn->prepare("
      INSERT INTO dbo.Usuario
        (nombre, apellido, email, [contraseña], rol)
      VALUES
        (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$nombre, $apellido, $email, $hash, $rol]);

    // 3) Si todo salió bien, devolvemos éxito
    echo json_encode([
      'exito' => true
    ]);
} catch (Exception $e) {
    // Si hubo cualquier error (conexión, SQL, etc.), devolvemos el mensaje
    echo json_encode([
      'exito' => false,
      'error' => $e->getMessage()
    ]);
}
?>
