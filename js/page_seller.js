document.addEventListener("DOMContentLoaded", function () {
  const btnPerfil = document.getElementById("btn-perfil");
  const formPerfil = document.getElementById("perfil-form");

  btnPerfil.addEventListener("click", function (e) {
    e.preventDefault();
    formPerfil.style.display = "block";
    // Si quieres ocultar otros formularios, puedes hacerlo aquí
    // Después del login/registro exitoso...
    fetch("/api/get_usuario.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_usuario: idUsuario }), // idUsuario debe venir del login
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
});

