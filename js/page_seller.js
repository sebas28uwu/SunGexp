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
      body: JSON.stringify({ id_usuario: usuarioId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          document.getElementById("empresa").value =
            data.usuario.empresa || "";
          document.getElementById("tienda").value =
            data.usuario.tienda || "";
          document.getElementById("ruc").value = data.usuario.ruc || "";
        }
      });
  });
});
