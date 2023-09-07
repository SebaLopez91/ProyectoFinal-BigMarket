
principal()

function principal() {
  let productosOriginal = [
    { id: 1, nombre: "Fernet Branca", categoria: "bebidas", stock: 2, precio: 5800, rutaImagen: "fernet.jpg" },
    { id: 2, nombre: "Tomate", categoria: "verduleria", stock: 7, precio: 2800, rutaImagen: "tomate.jpg" },
    { id: 3, nombre: "Lechuga", categoria: "verduleria", stock: 4, precio: 1600, rutaImagen: "lechuga.jpg" },
    { id: 4, nombre: "Cebolla", categoria: "verduleria", stock: 1, precio: 1500, rutaImagen: "cebolla.jpg" },
    { id: 5, nombre: "Coca-cola", categoria: "bebidas", stock: 3, precio: 800, rutaImagen: "coca.jpg" },
    { id: 6, nombre: "Zanahoria", categoria: "verduleria", stock: 8, precio: 900, rutaImagen: "zanahoria.jpg" },
    { id: 7, nombre: "Pollo", categoria: "carnes", stock: 7, precio: 1950, rutaImagen: "pollo.jpg" },
    { id: 8, nombre: "Cerveza", categoria: "bebidas", stock: 7, precio: 650, rutaImagen: "cerveza.jpg" },
    { id: 9, nombre: "Vacio", categoria: "carnes", stock: 7, precio: 3100, rutaImagen: "vacio.jpg" },
    { id: 10, nombre: "Agua", categoria: "bebidas", stock: 7, precio: 500, rutaImagen: "agua.jpg" },
    { id: 11, nombre: "Asado", categoria: "carnes", stock: 7, precio: 2850, rutaImagen: "asado.jpg" },
    { id: 12, nombre: "Lactal", categoria: "panificado", stock: 7, precio: 800, rutaImagen: "lactal.jpg" },
    { id: 13, nombre: "Frances", categoria: "panificado", stock: 7, precio: 1100, rutaImagen: "frances.jpg" },
    { id: 14, nombre: "Shampoo", categoria: "higene", stock: 7, precio: 1300, rutaImagen: "shampoo.jpg" },
    { id: 15, nombre: "Enjuague", categoria: "higene", stock: 7, precio: 1280, rutaImagen: "enjuague.jpg" },
    { id: 16, nombre: "Trapo de piso", categoria: "limpieza", stock: 7, precio: 2850, rutaImagen: "trapo.jpg" },
    { id: 17, nombre: "Escoba", categoria: "limpieza", stock: 7, precio: 2850, rutaImagen: "escoba.jpg" },
  

  ]

  let inputBuscador = document.getElementById("buscador")
  let botonBuscar = document.getElementById("buscar")
  botonBuscar.addEventListener("click", () => filtrar(productosOriginal, inputBuscador, "nombre"))

  let filtrosCategoria = document.getElementsByClassName("filtroCategoria")
  for (const filtroCategoria of filtrosCategoria) {
    filtroCategoria.addEventListener("click", () => filtrar(productosOriginal, filtroCategoria, "categoria"))
  }

  let botonFinalizarCompra = document.getElementById("finalizarCompra")
  botonFinalizarCompra.addEventListener("click", finalizarCompra)

  renderizarCarrito()
  renderizarTarjetas(productosOriginal)
}

function finalizarCompra() {
  let carrito = recuperarCarrito()
  if (carrito.length > 0) {
    localStorage.removeItem("carrito")
    renderizarCarrito()
    Swal.fire({
      icon: 'success',
      title: 'Finalizaste tu compra',
      text: '¡Gracias!',
    })
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: '¡No tienes nada en el carrito!',
    })
  }
}

function filtrar(productos, input, propiedad) {
  let productosFiltrados = productos.filter(producto => producto[propiedad].includes(input.value))
  renderizarTarjetas(productosFiltrados)
}

function renderizarTarjetas(productos) {
  let contenedor = document.getElementById("productos")
  contenedor.innerHTML = ""
  productos.forEach(producto => {
    let tarjetaProducto = document.createElement("div")
    tarjetaProducto.classList.add("tarjetaProducto")
    tarjetaProducto.innerHTML = 
    ` <h3>${producto.nombre}</h3>
     <div class=imagen style="background-image: url(./img/${producto.rutaImagen})"> </div> 
     <p>${"$" + producto.precio}</p>
      <button id=${producto.id}>Agregar al carrito</button>
    `
    contenedor.appendChild(tarjetaProducto)

    let botonAgregarAlCarrito = document.getElementById(producto.id)
    botonAgregarAlCarrito.addEventListener("click", (e) => agregarAlCarrito(productos, e))
  })
}

function agregarAlCarrito(productos, e) {
  let carrito = recuperarCarrito()
  let productoBuscado = productos.find(producto => producto.id === Number(e.target.id))
  let productoEnCarrito = carrito.find(producto => producto.id === productoBuscado.id)
  if (productoBuscado.stock > 0) {
    Swal.fire({
      position: 'top-center',
      icon: 'success',
      title: 'Se agrego tu producto al carrito',
      showConfirmButton: false,
      timer: 1000
    })
    productoBuscado.stock--

    if (productoEnCarrito) {
      productoEnCarrito.unidades++
      productoEnCarrito.subtotal = productoEnCarrito.precioUnitario * productoEnCarrito.unidades
    } else {
      carrito.push({
        id: productoBuscado.id,
        nombre: productoBuscado.nombre,
        precioUnitario: productoBuscado.precio,
        subtotal: productoBuscado.precio,
        unidades: 1
      })
    }
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: '¡No quedan mas unidades!',
    })
  }

  localStorage.setItem("carrito", JSON.stringify(carrito))

  renderizarCarrito()
}

function renderizarCarrito() {
  let contenedor = document.getElementById("carrito")
  contenedor.innerHTML = ""
  let carrito = recuperarCarrito()

  carrito.forEach(producto => {
    let tarjetaProducto = document.createElement("div")
    tarjetaProducto.innerHTML = `
      <h6>${producto.nombre}</h6>
      <p>${producto.precioUnitario} </p>
      <p>${producto.unidades}</p>
      <p>${producto.subtotal}</p>
    `
    contenedor.appendChild(tarjetaProducto)
  })
}

function recuperarCarrito() {
  return localStorage.getItem("carrito") ? JSON.parse(localStorage.getItem("carrito")) : []
}
