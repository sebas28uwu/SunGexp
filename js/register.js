// Aseguramos que el DOM esté cargado antes de buscar elementos
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('formRegister');
  const mensajeDiv = document.getElementById('mensaje');

  form.onsubmit = async function(e) {
    e.preventDefault(); // Previene recarga automática del formulario

    // --- 1) Leemos los valores de cada campo ---
    const nombre     = document.getElementById('firstName').value.trim();
    const apellido   = document.getElementById('lastName').value.trim();
    const correo     = document.getElementById('email').value.trim();
    const contrasena = document.getElementById('password').value;
    const confirmar  = document.getElementById('confirmPassword').value;

    // Leemos el rol seleccionado (radio)
    let rol = '';
    const radioSeleccionado = document.querySelector('input[name="role"]:checked');
    if (radioSeleccionado) {
      rol = radioSeleccionado.value; // "cliente" o "vendedor"
    }

    // --- 2) Validaciones básicas ---
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

    // --- 3) Armamos el objeto que convertiremos a JSON ---
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

      // Si el servidor devuelve un código distinto a 200, generamos error
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      // Interpretamos la respuesta JSON del PHP
      const data = await resp.json();

      // --- 5) Mostramos el resultado ---
      if (data.exito) {
        mensajeDiv.textContent = '¡Registro exitoso!';
        mensajeDiv.style.color = 'green';
        // Opcional: limpiar formulario o redirigir a login
        // form.reset();
        // window.location.href = 'login.html';
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
