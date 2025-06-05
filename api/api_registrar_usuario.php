<?php
// Le decimos al cliente que la respuesta será JSON
header('Content-Type: application/json');
// En caso de que quieras aceptar peticiones desde otros orígenes (CORS)
header('Access-Control-Allow-Origin: *');

// Leemos el JSON que envía el front-end
$data = json_decode(file_get_contents('php://input'), true);

// Validación básica de campos recibidos
$nombre     = trim($data['nombre']     ?? '');
$apellido   = trim($data['apellido']   ?? '');
$correo     = trim($data['correo']     ?? '');
$contrasena = $data['contrasena']      ?? '';
$rol        = $data['rol']             ?? '';

if (!$nombre || !$apellido || !$correo || !$contrasena || !$rol) {
    echo json_encode([
      'exito' => false,
      'error' => 'Faltan campos obligatorios'
    ]);
    exit;
}

// Hasheamos la contraseña antes de almacenarla
$hash = password_hash($contrasena, PASSWORD_DEFAULT);

// ** Configura aquí tu conexión a la base de datos ** 
// (en este ejemplo, a Azure SQL Server; si fuera MySQL local, cambiaría el DSN).
$serverName = 'sl-sungexp-prod-0001.database.windows.net';
$database   = 'database-sungexp';
$username   = 'adminuserdb';
$password   = 'Basededatos1@';

try {
    // Conexión con PDO para SQL Server
    $conn = new PDO("sqlsrv:server=$serverName;Database=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1) Verificamos que no exista ya un usuario con el mismo correo
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE correo = ?");
    $stmt->execute([$correo]);
    if ($stmt->fetch()) {
        echo json_encode([
          'exito' => false,
          'error' => 'Correo ya registrado'
        ]);
        exit;
    }

    // 2) Insertamos el nuevo usuario
    $stmt = $conn->prepare("
      INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol)
      VALUES (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$nombre, $apellido, $correo, $hash, $rol]);

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
