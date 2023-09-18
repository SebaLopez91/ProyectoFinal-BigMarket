function principal(productosBM) {
  let productosOriginal = productosBM;

  let inputBuscador = document.getElementById("buscador");
  let botonBuscar = document.getElementById("buscar");
  botonBuscar.addEventListener("click", () =>
    filtrar(productosOriginal, inputBuscador, "nombre")
  );

  let filtrosCategoria = document.getElementsByClassName("filtroCategoria");
  for (const filtroCategoria of filtrosCategoria) {
    filtroCategoria.addEventListener("click", () =>
      filtrar(productosOriginal, filtroCategoria, "categoria")
    );
  }

  let botonFinalizarCompra = document.getElementById("finalizarCompra");
  botonFinalizarCompra.addEventListener("click", finalizarCompra);

  renderizarCarrito();
  renderizarTarjetas(productosOriginal);
}

function finalizarCompra() {
  let carrito = recuperarCarrito();
  if (carrito.length > 0) {
    localStorage.removeItem("carrito");
    renderizarCarrito();
    Swal.fire({
      icon: "success",
      title: "Finalizaste tu compra",
      text: "¡Gracias!",
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "¡No tienes nada en el carrito!",
    });
  }
}

function filtrar(productos, input, propiedad) {
  let productosFiltrados = productos.filter((producto) =>
    producto[propiedad].includes(input.value)
  );
  renderizarTarjetas(productosFiltrados);
}

function renderizarTarjetas(productos) {
  let contenedor = document.getElementById("productos");
  contenedor.innerHTML = "";
  productos.forEach((producto) => {
    let tarjetaProducto = document.createElement("div");
    tarjetaProducto.classList.add("tarjetaProducto");
    tarjetaProducto.innerHTML = ` <h3>${producto.nombre}</h3>
     <div class=imagen style="background-image: url(./img/${
       producto.rutaImagen
     })"> </div> 
     <p>${"$" + producto.precio}</p>
      <button id=${producto.id}>Agregar al carrito</button>
    `;
    contenedor.appendChild(tarjetaProducto);

    let botonAgregarAlCarrito = document.getElementById(producto.id);
    botonAgregarAlCarrito.addEventListener("click", (e) =>
      agregarAlCarrito(productos, e)
    );
  });
}

let verOcultarCarrito = document.getElementById("verCarrito");
verOcultarCarrito.addEventListener("click", mostrarOcultar);

function mostrarOcultar() {
  document.getElementById("productos").classList.toggle("oculto");
  document.getElementById("carrito").classList.toggle("oculto");
}

function agregarAlCarrito(productos, e) {
  let carrito = recuperarCarrito();
  let productoBuscado = productos.find(
    (producto) => producto.id === Number(e.target.id)
  );
  let productoEnCarrito = carrito.find(
    (producto) => producto.id === productoBuscado.id
  );
  if (productoBuscado.stock > 0) {
    Swal.fire({
      position: "top-center",
      icon: "success",
      title: "Se agrego tu producto al carrito",
      showConfirmButton: false,
      timer: 1000,
    });
    productoBuscado.stock--;

    if (productoEnCarrito) {
      productoEnCarrito.unidades++;
      productoEnCarrito.subtotal =
        productoEnCarrito.precioUnitario * productoEnCarrito.unidades;
    } else {
      carrito.push({
        id: productoBuscado.id,
        nombre: productoBuscado.nombre,
        precioUnitario: productoBuscado.precio,
        subtotal: productoBuscado.precio,
        unidades: 1,
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "¡No quedan mas unidades!",
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  renderizarCarrito();
}

function renderizarCarrito() {
  let contenedor = document.getElementById("carrito");
  contenedor.innerHTML = "";
  let carrito = recuperarCarrito();

  carrito.forEach((producto) => {
    let tarjetaProducto = document.createElement("div");
    tarjetaProducto.innerHTML = `
      <h6>${producto.nombre}</h6>
      <p>${producto.precioUnitario} </p>
      <p>${producto.unidades}</p>
      <p>${producto.subtotal}</p>
    `;
    contenedor.appendChild(tarjetaProducto);
  });
}

function recuperarCarrito() {
  return localStorage.getItem("carrito")
    ? JSON.parse(localStorage.getItem("carrito"))
    : [];
}
fetch("./productos.json")
  .then((respuesta) => respuesta.json())
  .then((productos) => principal(productos))
  .catch((error) => console.log(error));
