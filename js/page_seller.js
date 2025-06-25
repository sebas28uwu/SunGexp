document.addEventListener("DOMContentLoaded", function () {
  const btnPerfil = document.getElementById("btn-perfil");
  const btnTienda = document.getElementById("btn-tienda");
  const formPerfil = document.getElementById("perfil-form");
  const tiendaSection = document.getElementById("tienda-section"); 
  const idUsuario = localStorage.getItem("id_usuario");

  // Función para ocultar todas las secciones
  function ocultarTodo() {
    formPerfil.style.display = "none";
    tiendaSection.style.display = "none";
    // ...agrega más si tienes nuevas secciones
  }

  // --- MI PERFIL ---
  btnPerfil.addEventListener("click", function (e) {
    e.preventDefault();
    ocultarTodo();
    formPerfil.style.display = "block";
    fetch("/api/vendedor/get_vendedor.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: idUsuario }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("usuario").textContent =
            data.usuario.nombre || "";
          document.getElementById("correo").textContent =
            data.usuario.email || "";
          document.getElementsByName("empresa")[0].value =
            data.usuario.empresa || "";
          document.getElementsByName("tienda")[0].value =
            data.usuario.tienda || "";
          document.getElementsByName("ruc")[0].value = data.usuario.ruc || "";
        } else {
          alert("Usuario no encontrado");
        }
      });
  });

  // --- MI TIENDA ---
  btnTienda.addEventListener("click", function (e) {
    e.preventDefault();
    ocultarTodo();
    tiendaSection.style.display = "block";
    cargarTienda();
  });

  // GUARDAR DATOS DE PERFIL
  formPerfil.addEventListener("submit", function (e) {
    e.preventDefault();
    const empresa = document.getElementsByName("empresa")[0].value;
    const tienda = document.getElementsByName("tienda")[0].value;
    const ruc = document.getElementsByName("ruc")[0].value;

    fetch("/api/vendedor/actualizar_vendedor.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: idUsuario, empresa, tienda, ruc }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Datos guardados correctamente");
          formPerfil.style.display = "none";
        } else {
          alert("Error al guardar: " + data.error);
        }
      });
  });

  // Cerrar sesión
  document.querySelector(".logout").addEventListener("click", function () {
    localStorage.removeItem("id_usuario");
    window.location.href = "/html/login_register.html";
  });

  // --- FUNCIÓN PARA CARGAR LA TIENDA ---
  function cargarTienda() {
    fetch("/api/vendedor/get_vendedor.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: idUsuario }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("nombre-tienda").textContent =
            data.usuario.tienda || "(No registrada)";
          // Ejemplo de fetch para publicaciones (a futuro)
          fetch("/api/vendedor/listar_publicaciones.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_vendedor: idUsuario }),
          })
            .then((res) => res.json())
            .then((datos) => {
              const tbody = document.getElementById("tabla-publicaciones");
              tbody.innerHTML = "";
              (datos.publicaciones || []).forEach((publi) => {
                tbody.innerHTML += `<tr>
      <td>${publi.nombre_producto}</td>
      <td>${publi.tipo_producto}</td>
      <td>${publi.precio}</td>
      <td>${publi.stock}</td>
    </tr>`;
              });
            });
        } else {
          document.getElementById("nombre-tienda").textContent =
            "(No registrada)";
          document.getElementById("tabla-publicaciones").innerHTML = "";
        }
      });
  }
});
