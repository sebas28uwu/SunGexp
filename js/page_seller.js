document.addEventListener("DOMContentLoaded", function () {
  const btnPerfil = document.getElementById("btn-perfil");
  const btnTienda = document.getElementById("btn-tienda");
  const formPerfil = document.getElementById("perfil-form");
  const tiendaSection = document.getElementById("tienda-section");
  const idUsuario = localStorage.getItem("id_usuario");
  const nombreTiendaSpan = document.getElementById("nombre-tienda");
  const logoTiendaImg = document.getElementById("logo-tienda");
  const descTiendaSpan = document.getElementById("desc-tienda");
  const contactoTiendaSpan = document.getElementById("contacto-tienda");
  const nombreTiendaPerfil = document.getElementById("nombre-tienda-perfil");
  const btnVentas = document.getElementById("btn-ventas");
  const ventasSection = document.getElementById("ventas-section");
  const ventasAgregarBtn = document.querySelector(".ventas-agregar-btn");
  const modalAgregarVenta = document.getElementById("modal-agregar-venta");

  // Función para ocultar todas las secciones
  function ocultarTodo() {
    formPerfil.style.display = "none";
    tiendaSection.style.display = "none";
    if (ventasSection) ventasSection.style.display = "none";
    if (facturacionSection) facturacionSection.style.display = "none";
    const resumenSection = document.getElementById('resumen-section');
    if (resumenSection) resumenSection.style.display = "none";
    const reporteMensualSection = document.getElementById('reporte-mensual-section');
    if (reporteMensualSection) reporteMensualSection.style.display = "none";
    // ...agrega aquí otras secciones principales si las hay
  }

  // --- MI PERFIL ---
  btnPerfil.addEventListener("click", function (e) {
    e.preventDefault();
    ocultarTodo();
    formPerfil.style.display = "block";
    cargarTienda(); // Para mostrar el nombre de la tienda en el perfil
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
          guardarNombreVendedor(data.usuario.nombre || "");
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

  // --- VENTAS (ícono etiqueta) ---
  const btnVentasEtiqueta = document.querySelector('a[href="#"]:has(.bi-tag)');
  if (btnVentasEtiqueta && ventasSection) {
    btnVentasEtiqueta.addEventListener("click", function (e) {
      e.preventDefault();
      ocultarTodo();
      ventasSection.style.display = "block";
    });
  }

  // Mostrar modal de agregar venta
  if (ventasAgregarBtn && modalAgregarVenta) {
    ventasAgregarBtn.addEventListener("click", function () {
      modalAgregarVenta.style.display = "flex";
    });
  }

  // --- FUNCIÓN PARA CARGAR LA TIENDA ---
  function cargarTienda() {
    fetch("/api/vendedor/get_tienda.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_vendedor: idUsuario }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (nombreTiendaSpan) nombreTiendaSpan.textContent = data.tienda.nombre || "(No registrada)";
          if (logoTiendaImg) logoTiendaImg.src = data.tienda.logo_url || "";
          if (descTiendaSpan) descTiendaSpan.textContent = data.tienda.descripcion || "";
          if (contactoTiendaSpan) contactoTiendaSpan.textContent = data.tienda.contacto || "";
          if (nombreTiendaPerfil) nombreTiendaPerfil.textContent = data.tienda.nombre || "(No registrada)";
          // Ejemplo de fetch para publicaciones (a futuro)
          fetch("/a", {
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
          window._nombreTiendaFact = data.tienda.nombre || '';
        } else {
          if (nombreTiendaSpan) nombreTiendaSpan.textContent = "(No registrada)";
          if (logoTiendaImg) logoTiendaImg.src = "";
          if (descTiendaSpan) descTiendaSpan.textContent = "";
          if (contactoTiendaSpan) contactoTiendaSpan.textContent = "";
          if (nombreTiendaPerfil) nombreTiendaPerfil.textContent = "(No registrada)";
          document.getElementById("tabla-publicaciones").innerHTML = "";
        }
      });
  }

  // --- Lógica de productos para sección ventas ---
  const productForm = document.getElementById('productForm');
  const productCatalog = document.getElementById('productCatalog');
  const modal = document.getElementById('modal');
  const openFormBtn = document.getElementById('openFormBtn');
  const closeModal = document.getElementById('closeModal');
  const imageInput = document.getElementById('productImage');
  const imagePreview = document.getElementById('imagePreview');

  let products = JSON.parse(localStorage.getItem('products')) || [];

  function renderCatalog() {
      if (!productCatalog) return;
      productCatalog.innerHTML = '';
      if (products.length === 0) {
          productCatalog.innerHTML = '<p>No hay productos agregados.</p>';
          return;
      }
      products.forEach((product, index) => {
          const price = parseFloat(product.price);
          const discount = parseInt(product.discount) || 0;
          let priceHtml = `<span class='product-price'>S/ ${price.toFixed(2)}</span>`;
          if (discount > 0) {
              const oldPrice = price / (1 - discount / 100);
              priceHtml = `
                  <span class='product-price'>S/ ${price.toFixed(2)}</span>
                  <span class='product-old-price'>S/ ${oldPrice.toFixed(2)}</span>
                  <span class='product-discount'>-${discount}%</span>
              `;
          }
          const card = document.createElement('div');
          card.className = 'product-card';
          card.innerHTML = `
              <button class="delete-btn" data-index="${index}" title="Eliminar">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2"/>
                    <rect x="5" y="6" width="14" height="14" rx="2" stroke="currentColor" stroke-width="2"/>
                    <path d="M10 11v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M14 11v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
              </button>
              <div class="product-card-content">
                  <div class="product-card-img-section">
                      <img src="${product.image}" alt="${product.name}" class="product-img">
                  </div>
                  <div class="product-card-info-section">
                      <div class="product-brand">${(product.brand || '').toUpperCase()}</div>
                      <div class="product-name">${product.name}</div>
                      <div class="product-category">${product.category}</div>
                      <div class="product-description">${product.description}</div>
                      <div class="product-price-row">${priceHtml}</div>
                      <div class="product-stock">Stock: ${product.stock}</div>
                  </div>
              </div>
          `;
          productCatalog.appendChild(card);
      });
  }

  if (productCatalog) {
    productCatalog.addEventListener('click', function(e) {
        if (e.target.closest('.delete-btn')) {
            const btn = e.target.closest('.delete-btn');
            const idx = btn.getAttribute('data-index');
            const card = btn.closest('.product-card');
            card.style.transition = 'opacity 0.3s, transform 0.3s';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.92) translateY(20px)';
            setTimeout(() => {
                products.splice(idx, 1);
                localStorage.setItem('products', JSON.stringify(products));
                renderCatalog();
            }, 280);
        }
    });
  }

  if (imageInput && imagePreview) {
      imageInput.addEventListener('input', function() {
          const url = imageInput.value.trim();
          if (url) {
              imagePreview.src = url;
              imagePreview.style.display = 'block';
          } else {
              imagePreview.src = '';
              imagePreview.style.display = 'none';
          }
      });
  }

  if (productForm) {
    productForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const imageUrl = document.getElementById('productImage').value.trim();
        const brand = document.getElementById('productBrand').value;
        const name = document.getElementById('productName').value;
        const description = document.getElementById('productDescription').value;
        const category = document.getElementById('productCategory').value;
        const price = document.getElementById('productPrice').value;
        const stock = document.getElementById('productStock').value;
        const discount = document.getElementById('productDiscount').value;

        // Enviar datos al backend para guardar en la base de datos
        fetch('/api/vendedor/agregar.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imagen_url: imageUrl,
            marca: brand,
            nombre: name,
            descripcion: description,
            categoria: category,
            precio: price,
            stock: stock,
            descuento: discount
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert('Producto agregado correctamente');
            renderCatalog();
            productForm.reset();
            if (imagePreview) {
              imagePreview.src = '';
              imagePreview.style.display = 'none';
            }
            closeModalWindow();
          } else {
            alert('Error al agregar: ' + (data.error || 'Error desconocido'));
          }
        });
    });
  }

  function openModalWindow() {
      modal.style.display = 'flex';
      productForm.reset();
      if (imagePreview) {
          imagePreview.src = '';
          imagePreview.style.display = 'none';
      }
  }
  function closeModalWindow() {
      modal.style.display = 'none';
      productForm.reset();
      if (imagePreview) {
          imagePreview.src = '';
          imagePreview.style.display = 'none';
      }
  }
  if (openFormBtn) openFormBtn.addEventListener('click', openModalWindow);
  if (closeModal) closeModal.addEventListener('click', closeModalWindow);
  window.addEventListener('click', function(e) {
      if (e.target === modal) closeModalWindow();
  });

  // Inicializar catálogo al cargar
  renderCatalog();

  // --- Lógica de edición de tienda ---
  const editarTiendaBtn = document.getElementById('editar-tienda-btn');
  const formTienda = document.getElementById('form-tienda');
  const vistaTienda = document.getElementById('vista-tienda');
  const logoTiendaInput = document.getElementById('logo-tienda-input');
  const logoTiendaPreview = document.getElementById('logo-tienda-preview');
  const nombreTiendaInput = document.getElementById('nombre-tienda-input');
  const descTiendaInput = document.getElementById('desc-tienda-input');
  const contactoTiendaInput = document.getElementById('contacto-tienda-input');
  const cancelarTiendaBtn = document.getElementById('cancelar-tienda-btn');

  if (editarTiendaBtn && formTienda && vistaTienda) {
    editarTiendaBtn.addEventListener('click', function() {
      // Llenar los campos con los datos actuales
      logoTiendaInput.value = logoTiendaImg ? logoTiendaImg.src : '';
      logoTiendaPreview.src = logoTiendaImg ? logoTiendaImg.src : '';
      nombreTiendaInput.value = nombreTiendaSpan ? nombreTiendaSpan.textContent : '';
      descTiendaInput.value = descTiendaSpan ? descTiendaSpan.textContent : '';
      contactoTiendaInput.value = contactoTiendaSpan ? contactoTiendaSpan.textContent : '';
      formTienda.style.display = 'block';
      vistaTienda.style.display = 'none';
    });
  }
  if (logoTiendaInput && logoTiendaPreview) {
    logoTiendaInput.addEventListener('input', function() {
      logoTiendaPreview.src = logoTiendaInput.value.trim();
    });
  }
  if (cancelarTiendaBtn && formTienda && vistaTienda) {
    cancelarTiendaBtn.addEventListener('click', function() {
      formTienda.style.display = 'none';
      vistaTienda.style.display = 'block';
    });
  }
  if (formTienda) {
    formTienda.addEventListener('submit', function(e) {
      e.preventDefault();
      fetch('/api/vendedor/actualizar_tienda.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_vendedor: idUsuario,
          logo_url: logoTiendaInput.value.trim(),
          nombre: nombreTiendaInput.value.trim(),
          descripcion: descTiendaInput.value.trim(),
          contacto: contactoTiendaInput.value.trim()
        })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert('Tienda actualizada correctamente');
          formTienda.style.display = 'none';
          vistaTienda.style.display = 'block';
          cargarTienda();
        } else {
          alert('Error al actualizar: ' + (data.error || 'Error desconocido'));
        }
      });
    });
  }

  // --- FACTURACIÓN: Cuenta bancaria ---
  const facturacionSection = document.getElementById('facturacion-section');
  const btnFacturacion = Array.from(document.querySelectorAll('.sidebar nav a')).find(a => a.textContent.includes('Facturación'));
  const facturacionForm = document.getElementById('facturacion-form');
  const facturacionCuenta = document.getElementById('facturacion-cuenta');
  const bancoLogo = document.getElementById('banco-logo');

  // --- FACTURACIÓN: Tabs y métodos de pago ---
  const tabBanco = document.getElementById('tab-banco');
  const tabYape = document.getElementById('tab-yape');
  const formBanco = document.getElementById('form-banco');
  const formYape = document.getElementById('form-yape');
  const facturacionCCI = document.getElementById('facturacion-cci');
  const facturacionTelefono = document.getElementById('facturacion-telefono');
  const billeteraSelect = document.getElementById('billetera-select');
  const billeteraLogo = document.getElementById('billetera-logo');
  const nombreVendedorYape = document.getElementById('facturacion-nombre-vendedor-yape');
  const nombreTiendaYape = document.getElementById('facturacion-nombre-tienda-yape');

  if (tabBanco && tabYape && formBanco && formYape) {
    tabBanco.addEventListener('click', function() {
      tabBanco.classList.add('active');
      tabYape.classList.remove('active');
      formBanco.style.display = '';
      formYape.style.display = 'none';
    });
    tabYape.addEventListener('click', function() {
      tabYape.classList.add('active');
      tabBanco.classList.remove('active');
      formBanco.style.display = 'none';
      formYape.style.display = '';
    });
  }
  // Autocompletar nombres en ambos formularios
  function autocompletarNombresFacturacion() {
    const nombreVendedor = localStorage.getItem('nombre_vendedor') || '';
    const nombreTienda = (window._nombreTiendaFact || '');
    document.getElementById('facturacion-nombre-vendedor').value = nombreVendedor;
    document.getElementById('facturacion-nombre-tienda').value = nombreTienda;
    if (nombreVendedorYape) nombreVendedorYape.value = nombreVendedor;
    if (nombreTiendaYape) nombreTiendaYape.value = nombreTienda;
  }
  // Detectar billetera y mostrar logo
  function mostrarLogoBilletera() {
    let billetera = billeteraSelect.value;
    let logo = '';
    if (billetera === 'yape') {
      logo = 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Yape.png';
    } else if (billetera === 'plin') {
      logo = 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Plin_logo.png';
    }
    billeteraLogo.innerHTML = logo ? `<img src="${logo}" alt="${billetera}" title="${billetera}" />` : '';
  }
  if (billeteraSelect) billeteraSelect.addEventListener('change', mostrarLogoBilletera);
  if (facturacionTelefono) facturacionTelefono.addEventListener('input', mostrarLogoBilletera);
  // Inicializar logos y nombres al mostrar facturación
  function mostrarFacturacion() {
    ocultarTodo();
    if (facturacionSection) facturacionSection.style.display = 'block';
    cargarDatosFacturacion();
    autocompletarNombresFacturacion();
    mostrarLogoBilletera();
  }
  if (btnFacturacion && facturacionSection) {
    btnFacturacion.addEventListener('click', function(e) {
      e.preventDefault();
      mostrarFacturacion();
    });
  }
  function cargarDatosFacturacion() {
    const data = JSON.parse(localStorage.getItem('facturacion') || '{}');
    facturacionCuenta.value = data.cuenta || '';
    mostrarLogoBanco(facturacionCuenta.value);
  }
  function mostrarLogoBanco(numero) {
    // Detectar banco por prefijo o patrón (ejemplo simple)
    let banco = null;
    let logo = '';
    if (/^001/.test(numero)) {
      banco = 'BCP';
      logo = 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Logo_BCP.png';
    } else if (/^011/.test(numero)) {
      banco = 'Interbank';
      logo = 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Interbank_logo_2021.svg';
    } else if (/^002/.test(numero)) {
      banco = 'BBVA';
      logo = 'https://upload.wikimedia.org/wikipedia/commons/9/9f/BBVA_2019_logo.svg';
    } else if (/^003/.test(numero)) {
      banco = 'Scotiabank';
      logo = 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Scotiabank-logo.png';
    } else {
      banco = null;
      logo = '';
    }
    bancoLogo.innerHTML = logo ? `<img src="${logo}" alt="${banco}" title="${banco}" />` : '';
  }
  if (facturacionCuenta) {
    facturacionCuenta.addEventListener('input', function(e) {
      mostrarLogoBanco(e.target.value);
    });
  }
  if (facturacionForm) {
    facturacionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (tabBanco.classList.contains('active')) {
        localStorage.setItem('facturacion', JSON.stringify({
          tipo: 'banco',
          cuenta: facturacionCuenta.value,
          cci: facturacionCCI.value,
          banco: bancoLogo.querySelector('img') ? bancoLogo.querySelector('img').alt : '',
          nombre_vendedor: document.getElementById('facturacion-nombre-vendedor').value,
          nombre_tienda: document.getElementById('facturacion-nombre-tienda').value
        }));
      } else {
        localStorage.setItem('facturacion', JSON.stringify({
          tipo: 'billetera',
          telefono: facturacionTelefono.value,
          billetera: billeteraSelect.value,
          nombre_vendedor: nombreVendedorYape.value,
          nombre_tienda: nombreTiendaYape.value
        }));
      }
      alert('Datos de facturación guardados');
    });
  }

  // --- RESUMEN DE ÓRDENES ---
  const resumenSection = document.getElementById('resumen-section');
  const btnResumen = Array.from(document.querySelectorAll('.sidebar nav a')).find(a => a.textContent.includes('Resumen de ordenes'));
  const resumenFecha = document.getElementById('resumen-fecha');
  const resumenLista = document.getElementById('resumen-lista');
  const resumenTotalDia = document.getElementById('resumen-total-dia');
  const resumenObjetivo = document.getElementById('resumen-objetivo');
  const resumenAporteDia = document.getElementById('resumen-aporte-dia');
  const resumenAporteMonto = document.getElementById('resumen-aporte-monto');
  const resumenGrafico = document.getElementById('resumen-grafico');
  const resumenNombreGrafico = document.getElementById('resumen-nombre-grafico');

  // Datos de ejemplo (simulación)
  const ventasEjemplo = [
    { producto: 'Polo Cuatro fantásticos', cantidad: 2, fecha: '2025-07-08', monto: 90 },
    { producto: 'Polo Jujutsu Kaisen', cantidad: 1, fecha: '2025-07-08', monto: 50 },
    { producto: 'Collar Deadpool y Wolverine', cantidad: 3, fecha: '2025-07-07', monto: 90 },
    { producto: 'Polo Cuatro fantásticos', cantidad: 1, fecha: '2025-07-01', monto: 45 },
    { producto: 'Polo Jujutsu Kaisen', cantidad: 2, fecha: '2025-07-02', monto: 100 },
  ];

  function mostrarResumen() {
    ocultarTodo();
    if (resumenSection) resumenSection.style.display = 'flex';
    cargarResumen();
  }
  if (btnResumen && resumenSection) {
    btnResumen.addEventListener('click', function(e) {
      e.preventDefault();
      mostrarResumen();
    });
  }
  function cargarResumen() {
    // Fecha seleccionada o hoy
    const fecha = resumenFecha.value || new Date().toISOString().slice(0, 10);
    resumenFecha.value = fecha;
    // Filtrar ventas del día
    const ventasDia = ventasEjemplo.filter(v => v.fecha === fecha);
    resumenLista.innerHTML = ventasDia.map(v => `<tr><td style='padding:6px;'>${v.producto}</td><td style='padding:6px;'>${v.cantidad}</td><td style='padding:6px;'>S/ ${v.monto.toFixed(2)}</td><td style='padding:6px;'>${v.fecha}</td></tr>`).join('') || '<tr><td colspan="4" style="color:#888; text-align:center;">Sin ventas</td></tr>';
    // Calcular total del día
    const totalDia = ventasDia.reduce((acc, v) => acc + v.monto, 0);
    resumenTotalDia.textContent = totalDia.toFixed(2);
    // Objetivo diario
    let objetivo = parseFloat(localStorage.getItem('resumen_objetivo_diario') || '100');
    if (resumenObjetivo.value) objetivo = parseFloat(resumenObjetivo.value);
    resumenObjetivo.value = objetivo;
    // Aporte del día
    const aporte = objetivo > 0 ? (totalDia / objetivo) * 100 : 0;
    resumenAporteDia.textContent = aporte.toFixed(1) + '%';
    resumenAporteMonto.textContent = 'S/ ' + totalDia.toFixed(2);
    // Gráfico
    mostrarGraficoResumen(totalDia, objetivo);
    // Nombre del gráfico
    resumenGrafico && resumenGrafico.setAttribute('aria-label', resumenNombreGrafico.value);
  }
  if (resumenFecha) resumenFecha.addEventListener('change', cargarResumen);
  if (resumenObjetivo) resumenObjetivo.addEventListener('input', function() {
    localStorage.setItem('resumen_objetivo_diario', resumenObjetivo.value);
    cargarResumen();
  });
  if (resumenNombreGrafico) resumenNombreGrafico.addEventListener('input', cargarResumen);
  // Gráfico con Chart.js
  let chartResumen = null;
  function mostrarGraficoResumen(totalDia, objetivo) {
    if (!resumenGrafico) return;
    if (chartResumen) chartResumen.destroy();
    chartResumen = new window.Chart(resumenGrafico.getContext('2d'), {
      type: 'doughnut',
      data: {
        labels: ['Aporte del día', 'Restante'],
        datasets: [{
          data: [totalDia, Math.max(0, objetivo - totalDia)],
          backgroundColor: ['#ffe600', '#eee'],
          borderWidth: 1
        }]
      },
      options: {
        cutout: '70%',
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true },
          title: { display: false }
        }
      }
    });
  }

  // --- REPORTE MENSUAL ---
  const reporteMensualSection = document.getElementById('reporte-mensual-section');
  const btnReporteMensual = Array.from(document.querySelectorAll('.sidebar nav a')).find(a => a.textContent.includes('Reporte de ingresos mensual'));
  const selectPeriodo = document.getElementById('select-periodo');
  const selectMes = document.getElementById('select-mes');
  const selectAnio = document.getElementById('select-anio');
  const selectComparar = document.getElementById('select-comparar');
  const metricaVentasBrutas = document.getElementById('metrica-ventas-brutas');
  const metricaUnidades = document.getElementById('metrica-unidades');
  const metricaPromUnidad = document.getElementById('metrica-prom-unidad');
  const metricaCantVentas = document.getElementById('metrica-cant-ventas');
  const metricaPromVenta = document.getElementById('metrica-prom-venta');
  const metricaPorcentajes = document.querySelectorAll('.metrica-porcentaje');

  function cargarReporteMensual() {
    if (!selectPeriodo || !selectMes || !selectAnio) return;
    const dias = parseInt(selectPeriodo.value);
    const mes = selectMes.value;
    const anio = selectAnio.value;
    // Calcular fecha final y fecha inicial del periodo principal
    const fechaFin = new Date(`${anio}-${mes}-01`);
    fechaFin.setMonth(fechaFin.getMonth() + 1);
    fechaFin.setDate(0);
    const fechaInicio = new Date(fechaFin);
    fechaInicio.setDate(fechaFin.getDate() - dias + 1);
    // Filtrar ventas en el rango principal
    const ventasFiltradas = ventasEjemplo.filter(v => {
      const fechaVenta = new Date(v.fecha);
      return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
    });
    // Calcular métricas principales
    const ventasBrutas = ventasFiltradas.reduce((acc, v) => acc + v.monto, 0);
    const unidadesVendidas = ventasFiltradas.reduce((acc, v) => acc + v.cantidad, 0);
    const cantVentas = ventasFiltradas.length;
    const promUnidad = unidadesVendidas > 0 ? ventasBrutas / unidadesVendidas : 0;
    const promVenta = cantVentas > 0 ? ventasBrutas / cantVentas : 0;
    // Mostrar métricas principales
    metricaVentasBrutas.textContent = `S/ ${ventasBrutas.toFixed(2)}`;
    metricaUnidades.textContent = unidadesVendidas;
    metricaPromUnidad.textContent = `S/ ${promUnidad.toFixed(2)}`;
    metricaCantVentas.textContent = cantVentas;
    metricaPromVenta.textContent = `S/ ${promVenta.toFixed(2)}`;

    // --- COMPARACIÓN ---
    let ventasBrutasComp = 0, unidadesComp = 0, cantVentasComp = 0, promUnidadComp = 0, promVentaComp = 0;
    if (selectComparar) {
      let fechaInicioComp, fechaFinComp;
      if (selectComparar.value === 'anterior') {
        // Periodo anterior: mismo rango de días, justo antes del periodo principal
        fechaFinComp = new Date(fechaInicio);
        fechaFinComp.setDate(fechaInicio.getDate() - 1);
        fechaInicioComp = new Date(fechaFinComp);
        fechaInicioComp.setDate(fechaFinComp.getDate() - dias + 1);
      } else if (selectComparar.value === 'mismo_mes_anio_anterior') {
        // Mismo mes del año anterior
        fechaInicioComp = new Date(`${anio - 1}-${mes}-01`);
        fechaFinComp = new Date(fechaInicioComp);
        fechaFinComp.setMonth(fechaFinComp.getMonth() + 1);
        fechaFinComp.setDate(0);
      }
      // Filtrar ventas en el rango de comparación
      const ventasComp = ventasEjemplo.filter(v => {
        const fechaVenta = new Date(v.fecha);
        return fechaVenta >= fechaInicioComp && fechaVenta <= fechaFinComp;
      });
      ventasBrutasComp = ventasComp.reduce((acc, v) => acc + v.monto, 0);
      unidadesComp = ventasComp.reduce((acc, v) => acc + v.cantidad, 0);
      cantVentasComp = ventasComp.length;
      promUnidadComp = unidadesComp > 0 ? ventasBrutasComp / unidadesComp : 0;
      promVentaComp = cantVentasComp > 0 ? ventasBrutasComp / cantVentasComp : 0;
    }
    // Calcular y mostrar porcentajes de variación
    const variaciones = [
      [ventasBrutas, ventasBrutasComp],
      [unidadesVendidas, unidadesComp],
      [promUnidad, promUnidadComp],
      [cantVentas, cantVentasComp],
      [promVenta, promVentaComp],
    ];
    metricaPorcentajes.forEach((el, i) => {
      const [actual, comp] = variaciones[i];
      let porcentaje = '—%';
      if (comp > 0) {
        const varNum = ((actual - comp) / comp) * 100;
        porcentaje = (varNum > 0 ? '+' : '') + varNum.toFixed(1) + '%';
      } else if (actual > 0) {
        porcentaje = '+100%';
      }
      el.textContent = porcentaje;
    });
  }
  if (selectPeriodo && selectMes && selectAnio && selectComparar) {
    selectPeriodo.addEventListener('change', cargarReporteMensual);
    selectMes.addEventListener('change', cargarReporteMensual);
    selectAnio.addEventListener('change', cargarReporteMensual);
    selectComparar.addEventListener('change', cargarReporteMensual);
  }
  // Al mostrar la sección, cargar métricas
  if (btnReporteMensual && reporteMensualSection) {
    btnReporteMensual.addEventListener('click', function(e) {
      e.preventDefault();
      ocultarTodo();
      reporteMensualSection.style.display = 'block';
      cargarReporteMensual();
    });
  }
  // Mostrar mensaje si no hay ventas en el periodo
  function mostrarMensajeSinVentas(ventasFiltradas) {
    let mensaje = document.getElementById('mensaje-sin-ventas');
    if (!mensaje) {
      mensaje = document.createElement('div');
      mensaje.id = 'mensaje-sin-ventas';
      mensaje.style.color = '#b1a003';
      mensaje.style.fontWeight = 'bold';
      mensaje.style.marginTop = '18px';
      mensaje.style.fontSize = '1.1em';
      reporteMensualSection.appendChild(mensaje);
    }
    mensaje.textContent = ventasFiltradas.length === 0 ? 'No hay ventas en este periodo.' : '';
  }
  // Modificar cargarReporteMensual para llamar a mostrarMensajeSinVentas
  const oldCargarReporteMensual = cargarReporteMensual;
  cargarReporteMensual = function() {
    if (!selectPeriodo || !selectMes || !selectAnio) return;
    const dias = parseInt(selectPeriodo.value);
    const mes = selectMes.value;
    const anio = selectAnio.value;
    const fechaFin = new Date(`${anio}-${mes}-01`);
    fechaFin.setMonth(fechaFin.getMonth() + 1);
    fechaFin.setDate(0);
    const fechaInicio = new Date(fechaFin);
    fechaInicio.setDate(fechaFin.getDate() - dias + 1);
    const ventasFiltradas = ventasEjemplo.filter(v => {
      const fechaVenta = new Date(v.fecha);
      return fechaVenta >= fechaInicio && fechaVenta <= fechaFin;
    });
    oldCargarReporteMensual.apply(this, arguments);
    mostrarMensajeSinVentas(ventasFiltradas);
  }
  // Selectores para los botones de periodo, mes y año
  const btnsPeriodo = document.querySelectorAll('.btn-periodo');
  const btnsMes = document.querySelectorAll('.btn-mes');
  const btnsAnio = document.querySelectorAll('.btn-anio');
  // ... aquí irá la lógica de métricas y eventos para los botones ...

  ocultarTodo(); // Oculta todas las secciones al cargar la página
});
