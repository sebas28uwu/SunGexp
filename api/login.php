<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // si necesitas CORS

// Leer JSON recibido
$input = json_decode(file_get_contents('php://input'), true);
$correo = trim($input['correo']   ?? '');
$pass   = $input['password']      ?? '';

if (!$correo || !$pass) {
  echo json_encode(['exito'=>false, 'error'=>'Faltan correo o contraseña.']);
  exit;
}

// Conexión PDO (igual que tu registrar)
$server = 'sl-sungexp-prod-0001.database.windows.net';
$db     = 'database-sungexp';
$user   = 'adminuserdb';
$pwd    = 'Basededatos1@';

try {
  $conn = new PDO("sqlsrv:server=$server;Database=$db", $user, $pwd);
  $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  // 1) Buscar usuario por correo
  $stmt = $conn->prepare("SELECT id_usuario, contrasena, rol FROM usuarios WHERE correo = ?");
  $stmt->execute([$correo]);

  if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    // 2) Verificar contraseña
    if (password_verify($pass, $row['contrasena'])) {
      // Login exitoso
      // Opcional: session_start(); $_SESSION['user_id']=$row['id_usuario'];
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

  // Si llegamos aquí, fallo de credenciales
  echo json_encode(['exito'=>false, 'error'=>'Correo o contraseña inválidos.']);

} catch (Exception $e) {
  echo json_encode(['exito'=>false, 'error'=>'Error interno: '.$e->getMessage()]);
}
?>
