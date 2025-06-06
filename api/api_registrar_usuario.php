<?php
// Le decimos al navegador que responderemos en JSON
header('Content-Type: application/json');
// Si necesitas aceptar peticiones CORS, descomenta la siguiente línea
// header('Access-Control-Allow-Origin: *');

// 1) Leemos el JSON enviado desde JavaScript
$data = json_decode(file_get_contents('php://input'), true);

// 2) Capturamos cada campo en variables PHP (con su clave exacta)
$nombre     = trim($data['nombre']     ?? '');
$apellido   = trim($data['apellido']   ?? '');
$correo     = trim($data['correo']     ?? '');
$contrasena = $data['contrasena']      ?? '';
$rol        = $data['rol']             ?? '';

// 3) Validación básica: si falta alguno, devolvemos un error
if (!$nombre || !$apellido || !$correo || !$contrasena || !$rol) {
    echo json_encode([
      'exito' => false,
      'error' => 'Faltan campos obligatorios'
    ]);
    exit;
}

// 4) Hasheamos la contraseña antes de guardarla (siempre usar password_hash)
$hash = password_hash($contrasena, PASSWORD_DEFAULT);

// ─── 5) CONFIGURACIÓN DE CONEXIÓN A TU BASE DE DATOS ───
// En tu caso, Azure SQL Server. Asegúrate de que coincidan con tu servidor:
$serverName = 'sl-sungexp-prod-0001.database.windows.net';
$database   = 'database-sungexp';
$username   = 'adminuserdb';
$password   = 'Basededatos1@';

try {
    // 6) Conexión con PDO para SQL Server (Azure SQL)
    $conn = new PDO("sqlsrv:server=$serverName;Database=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 7) Verificamos que no exista ya un usuario con el mismo correo
    $stmt = $conn->prepare("SELECT id_usuario FROM dbo.Usuario WHERE email = ?");
    $stmt->execute([$correo]);
    if ($stmt->fetch()) {
        echo json_encode([
          'exito' => false,
          'error' => 'Correo ya registrado'
        ]);
        exit;
    }

    // 8) Insertamos el nuevo usuario en dbo.Usuario.
    //    Obs.: usamos corchetes en [contraseña] porque tu columna tiene tilde.
    $stmt = $conn->prepare("
      INSERT INTO dbo.Usuario
        (nombre, apellido, email, [contraseña], rol)
      VALUES
        (?, ?, ?, ?, ?)
    ");
    $stmt->execute([$nombre, $apellido, $correo, $hash, $rol]);

    // 9) Si todo salió bien, respondemos con éxito
    echo json_encode([
      'exito' => true
    ]);
} catch (Exception $e) {
    // 10) Si ocurre cualquier error (conexión, SQL, etc.), lo devolvemos en JSON
    echo json_encode([
      'exito' => false,
      'error' => $e->getMessage()
    ]);
}
?>
