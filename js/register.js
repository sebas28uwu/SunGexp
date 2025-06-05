// Nos aseguramos de que el DOM esté cargado antes de manipularlo
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formRegister');
  const mensajeDiv = document.getElementById('mensaje');

  form.onsubmit = async function(e) {
    e.preventDefault(); // Evita que el formulario recargue la página

    // --- 1) Leemos cada campo por su ID ---
    const nombre     = document.getElementById('firstName').value.trim();
    const apellido   = document.getElementById('lastName').value.trim();
    const correo     = document.getElementById('email').value.trim();
    const contrasena = document.getElementById('password').value;
    const confirmar  = document.getElementById('confirmPassword').value;

    // Para leer el rol (radio button)
    let rol = '';
    const radioSeleccionado = document.querySelector('input[name="role"]:checked');
    if (radioSeleccionado) {
      rol = radioSeleccionado.value; // "cliente" o "vendedor"
    }

    // --- 2) Validaciones básicas en el front-end ---
    if (!nombre || !apellido || !correo || !contrasena || !confirmar || !rol) {
      mensajeDiv.textContent = 'Por favor completa todos los campos.';
      mensajeDiv.style.color = 'red';
      return;
    }

    if (contrasena !== confirmar) {
      mensajeDiv.textContent = 'Las contraseñas no coinciden.';
      mensajeDiv.style.color = 'red';
      return;
    }

    // (Opcional) Aquí podrías validar formato de correo, longitud de contraseña, etc.

    // --- 3) Armamos el payload en formato JSON ---
    const payload = {
      nombre: nombre,
      apellido: apellido,
      correo: correo,
      contrasena: contrasena,
      rol: rol
    };

    // --- 4) Enviamos al API PHP ---
    try {
      const resp = await fetch('api/api_registrar_usuario.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // Si el servidor responde con un código distinto a 200, forzamos un error
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const data = await resp.json();

      // --- 5) Mostramos resultado en pantalla ---
      if (data.exito) {
        mensajeDiv.textContent = '¡Registro exitoso!';
        mensajeDiv.style.color = 'green';
        // Opcional: redirigir o limpiar formulario
        // window.location.href = 'index.html';
      } else {
        mensajeDiv.textContent = 'Error: ' + data.error;
        mensajeDiv.style.color = 'red';
      }
    } catch (err) {
      mensajeDiv.textContent = 'Error de red o del servidor: ' + err.message;
      mensajeDiv.style.color = 'red';
    }
  };
});
