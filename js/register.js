document.getElementById('registroForm').onsubmit = function(e) {
  e.preventDefault(); // Evita que el formulario recargue la página por defecto.

  // Recoge los valores de los campos del formulario.
  const nombre = this.nombre.value;
  const apellido = this.apellido.value;
  const correo = this.correo.value;
  const contrasena = this.contrasena.value;
  const confirmarContrasena = this.confirmarContrasena.value;
  const rol = this.rol.value;

  // Valida que las contraseñas sean iguales antes de continuar.
  if (contrasena !== confirmarContrasena) {
    document.getElementById('mensaje').textContent = "Las contraseñas no coinciden.";
    return; // Sale de la función y no continúa el registro.
  }

  // Envia los datos como JSON al API PHP usando fetch.
  fetch('api_registrar_usuario.php', {
    method: 'POST', // Método HTTP POST.
    headers: { 'Content-Type': 'application/json' }, // Le dice al servidor que los datos están en formato JSON.
    body: JSON.stringify({
      nombre, apellido, correo, contrasena, rol // Convierte los datos a JSON.
    })
  })
  .then(r => r.json()) // Convierte la respuesta de la API (que también es JSON) a objeto JS.
  .then(data => {
    // Si el registro fue exitoso, muestra mensaje de éxito.
    if (data.exito) {
      document.getElementById('mensaje').textContent = "¡Registro exitoso!";
    } else {
      // Si hubo error, muestra el mensaje de error enviado desde PHP.
      document.getElementById('mensaje').textContent = "Error: " + data.error;
    }
  });
};
