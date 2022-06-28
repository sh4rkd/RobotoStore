// DECLARO VARIABLES //
const carrito = document.querySelector('#carrito');
const microprocesadores = document.querySelector("#contenedorMicros");
const placasDeVideo = document.querySelector("#contenedorPlacasV");
const motherboard = document.querySelector("#contenedorMothers");
const memosRam = document.querySelector("#contenedorRam");
const discos = document.querySelector("#contenedorDiscos");
const contenedorCarrito = document.querySelector('#listaCarrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciarCarrito');
const listadoGeneral = document.querySelector('#listadoGeneral');
const numeroCarrito = document.getElementById("cart_menu_num");
const procesarCompraBtn = document.querySelector('#procesar-pedido');
let total = document.querySelector('#total');
const procesaPedido = document.querySelector("#containerProcesando")
let articulosCarrito = [];

//FUNCION CONSTRUCTORA DE PRODUCTOS//
function Producto(id, imagen, titulo, descripcion, precio) {
    this.id = id;
    this.imagen = imagen;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.precio = precio;
    this.cantidad = 1;
    this.subtotal = 0;
}

const listaProductos = []

articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

//ARRAYS PARA HTML//
const microprocesador = [];
const placaVideo = [];
const motherboards = [];
const memoriasRam = [];
const discosSSD = [];

const productosJSON = async () => {
    const res = await fetch('./stock.json')
    const data = await res.json();
    try {
        data.forEach(element => listaProductos.push(new Producto(element.id, element.imagen, element.titulo, element.descripcion, element.precio, element.cantidad, element.subtotal)));
        // microprocesador push map filter data.tipo = "microprocesador"
        data.filter(element => element.tipo === "microprocesador").forEach(element => microprocesador.push(element));
        // placaVideo push map filter data.tipo = "placaVideo"
        data.filter(element => element.tipo === "placavideo").forEach(element => placaVideo.push(element));
        // motherboards push map filter data.tipo = "motherboards"
        data.filter(element => element.tipo === "motherboards").forEach(element => motherboards.push(element));
        // memoriasRam push map filter data.tipo = "memoriasRam"
        data.filter(element => element.tipo === "memoriasram").forEach(element => memoriasRam.push(element));
        // discosSSD push map filter data.tipo = "discosSSD"
        data.filter(element => element.tipo === "discosssd").forEach(element => discosSSD.push(element));
        let micros = agregarHtml(microprocesador);
        let placasVideo = agregarHtml(placaVideo);
        let mothers = agregarHtml(motherboards);
        let rams = agregarHtml(memoriasRam);
        let disks = agregarHtml(discosSSD);
        microprocesadores.appendChild(micros);
        placasDeVideo.appendChild(placasVideo);
        motherboard.appendChild(mothers);
        memosRam.appendChild(rams);
        discos.appendChild(disks);
    } catch (error) {
        console.log(error);
    }
}

listadoGeneral.addEventListener('click', agregarProducto);
carrito.addEventListener('click', eliminarProducto);
document.addEventListener("click", (e) => {
    eliminarUnidad(e);
    sumarUnidad(e);
});

// VACIAR EL CARRITO //
vaciarCarritoBtn.addEventListener('click', () => {
    if (totalCantidad() === 0) {
        swal({
            title: "¡El carrito esta vacio!",
            text: "Agrega algunos productos al carrito",
            icon: "error",
        });
    } else {
        swal({
                title: "¿Estás seguro que deseas vaciar tu carrito?",
                text: "Si confirmas, eliminarás todos los productos que tienes agregados",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((confirma) => {
                if (confirma) {
                    swal({
                        title: "¡Carrito vacío!",
                    });
                    articulosCarrito = []; // RESETEA //
                    localStorage.removeItem('carrito');
                    limpiarHTML(); // ELIMINA TODO EL HTML //        
                    changeColor()
                    numeroCarrito.innerHTML = totalCantidad();
                }
            });
    }
});


//MOSTRAR EN EL HTML//
function agregarHtml(listaProductos) {
    let contenedorCards = document.createElement("div");
    contenedorCards.className = "accordion-body d-flex row justify-content-center";
    listaProductos.forEach(element => {
        //DESTRUCTURING//        
        const {
            id,
            imagen,
            titulo,
            descripcion,
            precio
        } = element;
        contenedorCards.innerHTML += `<div class="card mb-3" style="width: 18rem; background-color: #000;">
        <img src=${imagen} class="card-img-top fotoItem" alt="${titulo} data-id="${id}">        
        <div class="card-body product" id="${id}">
            <h5 class="card-title productTittle text-center">${titulo}</h5>
            <p class="card-text">${descripcion}</p>
            <span class="productPrice">${formatoMoneda(precio)}</span>
            <a class="btn btn-primary botonAgregar" data-id="${id}">Agregar al carrito</a>
            </div>                            
        </div>`
    });
    return contenedorCards;
}


abrirImagen = (e) => {
    let i;
    if (e.target.matches(".fotoItem")) {
        i = e.target.src;
        const divFondo = document.createElement('div');
        divFondo.innerHTML = `<div class="fondoFoto">        
        <img src=${i} class="ampliar" alt="imagen grande">        
        </div>`;
        document.body.appendChild(divFondo);
        let x = document.querySelector('.fondoFoto');
        x.addEventListener('click', () => {
            document.body.removeChild(divFondo);
        });
    }
}

document.addEventListener("click", (e) => {
    abrirImagen(e);
});


function agregarProducto(e) {
    if (e.target.classList.contains("botonAgregar")) {
        const productoSelecionado = e.target.parentElement.parentElement;
        leerDatosProducto(productoSelecionado);
        Toastify({
            text: "Producto agregado",
            duration: 2700,
            newWindow: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#000",
                color: "greenyellow",
            },
        }).showToast();
    }
}

// ELIMINAR PRODUCTO ENTERO DEL CARRITO (NO POR UNIDAD) //
function eliminarProducto(e) {
    if (e.target.classList.contains('borrarProducto')) {
        const productoId = e.target.getAttribute('data-id');
        // BORRA DE "articulosCarrito" SEGUN EL DATA ID //
        articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);
        carritoHTML(); // ITERA SOBRE carrito Y MUESTRA HTML //
    };
}

// LEE EL HTML QUE TIENE UN CLICK Y SACA LA INFO DEL PRODCUTO //
function leerDatosProducto(producto) {
    const id = producto.querySelector('.botonAgregar').getAttribute('data-id');
    const imagen = producto.querySelector('img').src;
    const titulo = producto.querySelector('.product h5').textContent;
    const descripcion = producto.querySelector('.product p').textContent;
    const precio = producto.querySelector('.product span').textContent;
    // CREA NUEVO PRODUCTO CON LOS DATOS QUE SACAMOS //
    const infoProducto = new Producto(id, imagen, titulo, descripcion, precio);
    infoProducto.subtotal = Number(infoProducto.precio.replace(',', "").replace("$", "")) * infoProducto.cantidad;
    // VERIFICA SI YA EXISTE EL PRODUCTO EN EL CARRITO //
    const existe = articulosCarrito.some(producto => producto.id === infoProducto.id);
    if (existe) {
        // ACTUALIZAR SOLO LA CANTIDAD Y NO DUPLICAR//
        const productos = articulosCarrito.map(producto => {
            if (producto.id === infoProducto.id) {
                producto.cantidad++;
                producto.subtotal = Number(producto.precio.replace(',', "").replace('$', "")) * producto.cantidad;
                return producto; // DEVUELVE OBJETO ACTUALIZADO SUMANDO CANTIDAD Y SUBTOTAL//
            } else {
                return producto; // DEVUELVE LOS OBJETOS QUE NO SE DUPLICAN, HACE UNA LINEA MÁS //
            }
        });
        // SPREAD OPERATOR - COPIA TODO O PARTE DE ARRAY U OBJETO EXISTENTE EN OTRO ARRAY U OBJETO - ENVÍA LOS PRODUCTOS DEL ARRAY COMO PARAMETROS INDIVIDUALES //
        articulosCarrito = [...productos];
    } else {
        // SE AGREGAN AL ARRAY //
        articulosCarrito = [...articulosCarrito, infoProducto];
    }
    carritoHTML();
}

function carritoHTML() {
    // LIMPIA HTML //
    limpiarHTML();
    // RECORRE EL ARRAY CARRITO Y MUESTRA EN HTML //
    articulosCarrito.forEach(producto => {
        const {
            imagen,
            titulo,
            precio,
            cantidad,
            subtotal,
            id
        } = producto;
        const row = document.createElement('tr');
        row.className = "text-center align-middle contenidoCarro";
        row.innerHTML = `
            <th class="imgProducto">
                <img src="${imagen}" width="50">
            </th>
            <th>${titulo}</th>            
            <th><i type="button" class="bi bi-dash-circle-fill menos" data-id="${id}"></i>${cantidad}<i type="button" class="bi bi-plus-circle-fill mas" data-id="${id}"></i></th>
            <th>${precio}</th>
            <th>${formatoMoneda(subtotal)}</th>
            
            <a class="bi bi-x-circle-fill borrarProducto" data-id="${id}" style="display: table-cell; vertical-align: inherit; color: #000; cursor:pointer; font-size: 1.05rem"></a>
            
        `;
        // HTML DEL carrito EN EL tbody //
        contenedorCarrito.appendChild(row);
    });
    numeroCarrito.innerHTML = totalCantidad();
    changeColor();
    // PASA EL carrito AL LOCALSTORAGE //
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// BORRA UNA UNIDAD DEL PRODUCTO CON EL - //
function eliminarUnidad(e) {
    let productoMenos;
    if (e.target.matches(".menos")) {
        productoMenos = articulosCarrito.find(
            (el) => Number(el.id) === Number(e.target.dataset.id)
        );
        if (productoMenos.cantidad == 1) {
            articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoMenos.id);
            carritoHTML();
        } else {
            productoMenos.cantidad--;
            productoMenos.subtotal = Number(productoMenos.precio.replace(',', "").replace('$', "")) * productoMenos.cantidad;
            carritoHTML();
        }
        sincronizarStorage();
    }
}

// SUMA UNA UNIDAD DEL PRODUCTO CON EL + //
function sumarUnidad(e) {
    if (e.target.matches(".mas")) {
        const productoMas = articulosCarrito.find(
            (el) => Number(el.id) === Number(e.target.dataset.id)
        );
        productoMas.cantidad++;
        productoMas.subtotal = Number(productoMas.precio.replace(',', "").replace('$', "")) * productoMas.cantidad;
        sincronizarStorage();
        carritoHTML();
    }
}

function totalCantidad() {
    let cantidadFinal = 0;
    cantidadFinal = articulosCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    return cantidadFinal;
}

//CAMBIA LOS COLORES DE CIRCULO Y NUMERO DEL CONTADOR DE CANTIDADES SI HAY AL MENOS 1 PRODUCTO EN EL CARRITO //
function changeColor() {
    if (totalCantidad() > 0) {
        numeroCarrito.style.color = "white";
        numeroCarrito.style.background = "red";
    } else {
        numeroCarrito.style.color = "greenyellow";
        numeroCarrito.style.background = "#000";
    }
}

// BORRA LOS PRODUCTOS DEL tbody //
function limpiarHTML() {
    // LIMPIA EL HTML - FUNCIONARÍA IGUAL CON = contenedorCarrito.innerHTML = '';
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
    total.innerHTML = formatoMoneda(totalGeneral());
}

function formatoMoneda(e) {
    return new Intl.NumberFormat("es-MX", {style: "currency", currency: "MXN"}).format(e);
}

function totalGeneral() {
    let productoTotal = articulosCarrito.reduce((total, producto) => total + producto.subtotal, 0);
    return productoTotal;
}


// PROCESAR COMPRA - CONFIRMAR //
procesarCompraBtn.addEventListener('click', () => {
    if (totalCantidad() === 0) {
        swal({
            title: "¡El carrito esta vacio!",
            text: "Agrega algunos productos al carrito",
            icon: "error",
        });
    } else {
        swal({
                title: "¿Estás seguro de que deseas realizar la compra?",
                text: "Una vez confirmada no podrás modificarla",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((confirma) => {
                if (confirma) {
                    procesarCompra();
                    irPagar();
                } else {
                    swal({
                        title: "Compra cancelada",
                        text: "Guardamos tus productos en el carrito.\nPodrás completar tu compra más tarde.",
                    });
                }
            });
    }
})

function irPagar() {
    setTimeout(() => {
        window.location.href = "./pagar.html";
    }, 4000);
}

function procesarCompra() {
    let cargaProcesando = document.createElement('div');
    cargaProcesando.className = "procesando";
    cargaProcesando.innerHTML += `<div class="sk-circle">
    <div class="sk-circle1 sk-child"></div>
    <div class="sk-circle2 sk-child"></div>
    <div class="sk-circle3 sk-child"></div>
    <div class="sk-circle4 sk-child"></div>
    <div class="sk-circle5 sk-child"></div>
    <div class="sk-circle6 sk-child"></div>
    <div class="sk-circle7 sk-child"></div>
    <div class="sk-circle8 sk-child"></div>
    <div class="sk-circle9 sk-child"></div>
    <div class="sk-circle10 sk-child"></div>
    <div class="sk-circle11 sk-child"></div>
    <div class="sk-circle12 sk-child"></div>
    <div id="tituloProcesando"><h4 class="animate__animated animate__zoomIn animate__infinite	infinite">Procesando</h4></div>
    </div>`;
    procesaPedido.appendChild(cargaProcesando);
}

document.addEventListener('DOMContentLoaded', () => {
    productosJSON();
    articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carritoHTML();
})