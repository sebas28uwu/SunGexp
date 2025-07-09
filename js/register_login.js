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

    if (contrasena.length < 6) {
      mensajeDiv.textContent = "La contraseña debe tener al menos 6 caracteres.";
      mensajeDiv.style.color = "red";
      return;
    }

    if (contrasena !== confirmar) {
      mensajeDiv.textContent = "Las contraseñas no coinciden.";
      mensajeDiv.style.color = "red";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
      mensajeDiv.textContent = "Por favor ingresa un email válido.";
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
      mensajeDiv.textContent = "Registrando usuario...";
      mensajeDiv.style.color = "blue";
      
      console.log("Enviando payload:", payload);
      
      const resp = await fetch("/api/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("Respuesta del servidor:", resp.status, resp.statusText);

      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const data = await resp.json();
      console.log("Datos recibidos:", data);

      if (data.exito && data.usuario) {
        mensajeDiv.textContent = "¡Registro exitoso! Redirigiendo...";
        mensajeDiv.style.color = "green";
        localStorage.setItem("id_usuario", data.usuario.id);
        localStorage.setItem("usuario_nombre", data.usuario.nombre);
        localStorage.setItem("usuario_rol", data.usuario.rol);
        
        setTimeout(() => {
          form.reset();
          if (data.usuario.rol === 'vendedor') {
            window.location.href = "/html/page_seller.html";
          } else {
            window.location.href = "/index.html";
          }
        }, 1500);
      } else {
        mensajeDiv.textContent = "Error: " + (data.error || "No se pudo registrar");
        mensajeDiv.style.color = "red";
        if (data.debug) {
          console.log("Debug info:", data.debug);
        }
      }
    } catch (err) {
      console.error("Error completo:", err);
      mensajeDiv.textContent = "Error de conexión. Verifica tu conexión a internet.";
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
      console.log("Enviando login:", { correo, password: pass });
      
      const resp = await fetch("/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password: pass }),
      });
      
      console.log("Respuesta login:", resp.status, resp.statusText);
      
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();
      
      console.log("Datos login:", data);

      if (data.exito && data.usuario) {
        localStorage.setItem("id_usuario", data.usuario.id);
        window.location.href = "/html/page_seller.html";
      } else {
        msgLogin.textContent = data.error || "Error de red o del servidor.";
      }
    } catch (err) {
      console.error("Error login:", err);
      msgLogin.textContent = "Error de red o servidor.";
    }
  };
});
