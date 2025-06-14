document.addEventListener("DOMContentLoaded", function () {
  const btnPerfil = document.getElementById("btn-perfil");
  const formPerfil = document.getElementById("perfil-form");
  const idUsuario = localStorage.getItem("id_usuario");

 

  btnPerfil.addEventListener("click", function (e) {
    e.preventDefault();
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
});
