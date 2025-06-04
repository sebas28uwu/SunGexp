<?php
header('Content-Type: application/json'); // Indica que la respuesta será JSON.

// Lee el JSON enviado por el JavaScript.
$data = json_decode(file_get_contents('php://input'), true);

// Asigna cada campo del JSON a una variable PHP.
$nombre = $data['nombre'];
$apellido = $data['apellido'];
$correo = $data['correo'];
$contrasena = $data['contrasena'];
$rol = $data['rol'];

// Hashea la contraseña antes de guardarla (más seguro).
$hash = password_hash($contrasena, PASSWORD_DEFAULT);

// Conexión a la base de datos (modifica con tus propios datos).
$serverName = 'sl-sungexp-prod-0001.database.windows.net';
$database = 'database-sungexp';
$username = 'adminuserdb'; 
$password = 'Basededatos1@';


try {
    // Crea una nueva conexión usando PDO.
    $conn = new PDO("sqlsrv:server=$serverName;Database=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Verifica que el correo no exista ya.
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE correo = ?");
    $stmt->execute([$correo]);
    if ($stmt->fetch()) {
        // Si existe, responde con error y termina.
        echo json_encode(['exito' => false, 'error' => 'Correo ya registrado']);
        exit;
    }

    // Inserta el nuevo usuario en la base de datos.
    $stmt = $conn->prepare("INSERT INTO usuarios (nombre, apellido, correo, contrasena, rol) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$nombre, $apellido, $correo, $hash, $rol]);

    // Si todo salió bien, responde con éxito.
    echo json_encode(['exito' => true]);
} catch (Exception $e) {
    // Si hubo algún error (de conexión, SQL, etc), responde con ese error.
    echo json_encode(['exito' => false, 'error' => $e->getMessage()]);
}
?>
