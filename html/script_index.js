 
  (function(){
    const API = 'https://20.11.51.152';
    const user = JSON.parse(localStorage.getItem('user')||'{}');
    // Panel vendedor si corresponde
    if(user.rol==='vendedor') document.getElementById('productos-vendedor').style.display = 'block';
    // Listar productos y catálogo
    fetch(`${API}/listar_productos.php`).then(r=>r.json()).then(j=>{
      if(j.status!=='success') return;
      // Catálogo
      const cat = document.getElementById('catalogoProductos');
      cat.innerHTML = '';
      j.data.forEach(p=>{
        const col = document.createElement('div');
        col.className = 'col-6 col-lg-4';
        col.innerHTML = `
          <div class="card h-100">
            <img src="${p.imagen_url||'img/default.jpg'}" class="card-img-top" alt="${p.nombre}">
            <div class="card-body d-flex flex-column">
              <h6 class="card-title">${p.nombre}</h6>
              <div class="mb-2"><span class="fw-bold">S/ ${p.precio.toFixed(2)}</span></div>
              <button class="btn btn-outline-primary mt-auto add-to-cart"
                data-id="${p.id_producto}" data-name="${p.nombre}" data-price="${p.precio}"
              >Agregar al carrito</button>
            </div>
          </div>`;
        cat.appendChild(col);
      });
      // Delegar click "Agregar al carrito"
      cat.addEventListener('click', e=>{
        if(!e.target.classList.contains('add-to-cart')) return;
        const btn = e.target;
        let cart = JSON.parse(localStorage.getItem('cart')||'[]');
        const item = {
          id_producto: btn.dataset.id,
          nombre:      btn.dataset.name,
          precio:      parseFloat(btn.dataset.price),
          cantidad:    1
        };
        const ex = cart.find(x=>x.id_producto==item.id_producto);
        ex ? ex.cantidad++ : cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
      });
      // Panel vendedor: listar tabla y dar de alta
      if(user.rol==='vendedor'){
        const tb = document.getElementById('productosTable');
        j.data.filter(p=>p.id_vendedor==user.id_usuario).forEach(p=>{
          const tr = document.createElement('tr');
          tr.innerHTML = `<td>${p.id_producto}</td><td>${p.nombre}</td><td>${p.precio.toFixed(2)}</td><td>${p.stock}</td><td>${p.categoria}</td>`;
          tb.appendChild(tr);
        });
        document.querySelector('#productos-vendedor form').addEventListener('submit', e=>{
          e.preventDefault();
          const f = e.target;
          const data = {
            product_name: f.product_name.value,
            price:        parseFloat(f.price.value),
            stock:        parseInt(f.stock.value),
            category:     f.category.value,
            vendedor_id:  user.id_usuario
          };
          fetch(`${API}/add_product.php`, {
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify(data)
          }).then(r=>r.json()).then(jt=>{
            alert(jt.status==='success' ? 'Producto agregado' : 'Error: '+jt.message);
            if(jt.status==='success') f.reset();
          });
        });
      }
    });

    // Carrito
    function renderCart(){
      const cart = JSON.parse(localStorage.getItem('cart')||'[]');
      const tb = document.getElementById('carritoTable');
      tb.innerHTML = '';
      cart.forEach(i=>{
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${i.nombre}</td><td>${i.cantidad}</td><td>${i.precio.toFixed(2)}</td><td>${(i.precio*i.cantidad).toFixed(2)}</td>`;
        tb.appendChild(tr);
      });
    }
    renderCart();

    document.getElementById('btnPagar').addEventListener('click', ()=>{
      if(!user.id_usuario){ alert('Debes iniciar sesión primero'); return; }
      const cart = JSON.parse(localStorage.getItem('cart')||'[]');
      if(!cart.length){ alert('Carrito vacío'); return; }
      const total = cart.reduce((a,b)=>a + b.precio*b.cantidad,0);
      fetch(`${API}/purchase.php`,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          id_cliente: user.id_usuario,
          total,
          items: cart.map(i=>({id_producto:i.id_producto,cantidad:i.cantidad}))
        })
      })
      .then(r=>r.json())
      .then(p=>{
        alert(p.status==='success' ? 'Compra registrada: #'+p.id_orden : 'Error: '+p.message);
        if(p.status==='success'){
          localStorage.removeItem('cart');
          renderCart();
        }
      });
    });

    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray("section .section-title").forEach(title=>{
      gsap.from(title,{y:50,opacity:0,duration:0.8,ease:"power3.out",scrollTrigger:{trigger:title,start:"top 80%"}});
    });
  })();
 