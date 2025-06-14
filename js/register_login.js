/* ====================== *
 *  Toggle Between        *
 *  Sign Up / Login       *
 * ====================== */
$(document).ready(function () {
  $("#goRight").on("click", function (e) {
    e.preventDefault();
    $("#slideBox").animate({ marginLeft: "0" });
    $(".topLayer").animate({ marginLeft: "100%" });
  });
  $("#goLeft").on("click", function (e) {
    e.preventDefault();
    if (window.innerWidth > 769) {
      $("#slideBox").animate({ marginLeft: "50%" });
    } else {
      $("#slideBox").animate({ marginLeft: "20%" });
    }
    $(".topLayer").animate({ marginLeft: "0" });
  });
});

/* ================ *
 *  Registro/Login  *
 *  (tu fetch etc.) *
 * ================ */

// API PARA REGISTRAR
// Nos aseguramos de que el DOM esté cargado antes de manipularlo+

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("form-register");
  const mensajeDiv = document.getElementById("mensaje");

  form.onsubmit = async function (e) {
    e.preventDefault(); // Evita que el formulario recargue la página por defecto

    // --- 1) Leemos cada campo por su ID ---
    const nombre = document.getElementById("firstName").value.trim();
    const apellido = document.getElementById("lastName").value.trim();
    const correo = document.getElementById("email").value.trim();
    const contrasena = document.getElementById("password").value;
    const confirmar = document.getElementById("confirmPassword").value;

    // Para leer el rol (radio button)
    let rol = "";
    const radioSeleccionado = document.querySelector(
      'input[name="role"]:checked'
    );
    if (radioSeleccionado) {
      rol = radioSeleccionado.value; // "cliente" o "vendedor"
    }

    // --- 2) Validaciones básicas en el front-end ---
    if (!nombre || !apellido || !correo || !contrasena || !confirmar || !rol) {
      mensajeDiv.textContent = "Por favor completa todos los campos.";
      mensajeDiv.style.color = "red";
      return;
    }

    if (contrasena !== confirmar) {
      mensajeDiv.textContent = "Las contraseñas no coinciden.";
      mensajeDiv.style.color = "red";
      return;
    }

    // En este punto, ya tenemos todos los datos necesarios. Creamos el payload:
    const payload = {
      nombre: nombre,
      apellido: apellido,
      email: correo, // clave “email” para que coincida con la columna
      contrasena: contrasena, // clave “contrasena” que PHP convertirá a “contraseña”
      rol: rol,
    };

    // --- 3) Enviamos al API PHP ---
    try {
      // IMPORTANTE: ruta absoluta bajo tu App Service o, en local, "localhost/..."
      const resp = await fetch("/api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Si el servidor responde con un código distinto a 200, forzamos un error
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      // La respuesta en JSON ({"exito":true} o {"exito":false,"error": "..."} )
      const data = await resp.json();

      // --- 4) Mostramos resultado en pantalla ---
      if (data.exito) {
        mensajeDiv.textContent = "¡Registro exitoso!";
        mensajeDiv.style.color = "green";
        // (Opcional) Limpiar formulario o redirigir:
        form.reset();
        window.location.href = "/html/page_seller.html";
      } else {
        mensajeDiv.textContent = "Error: " + data.error;
        mensajeDiv.style.color = "red";
      }
    } catch (err) {
      mensajeDiv.textContent = "Error de red o del servidor: " + err.message;
      mensajeDiv.style.color = "red";
    }
  };
});

//API PARA LOGEARTE

document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");
  const msgLogin = document.getElementById("mensaje-login");

  formLogin.onsubmit = async (e) => {
    e.preventDefault();
    // Dentro de tu handler de login…
    const correo = document.getElementById("correo-login").value.trim();
    const pass = document.getElementById("password-login").value;
    // … resto igual …

    if (!correo || !pass) {
      msgLogin.textContent = "Por favor completa ambos campos.";
      return;
    }

    try {
      const resp = await fetch("/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password: pass }),
      });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();

      if (data.exito) {
        // Ejemplo: guardas info en localStorage y rediriges
        localStorage.setItem("user", JSON.stringify(data.usuario));
        window.location.href = "/html/page_seller.html";
      } else {
        msgLogin.textContent = data.error;
      }
    } catch (err) {
      msgLogin.textContent = "Error de red o servidor.";
      console.error(err);
    }
  };
});
