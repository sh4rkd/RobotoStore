let total = document.querySelector('#total');

const carritoConfirmado = JSON.parse(localStorage.getItem("carrito"));

carritoConfirmado.forEach(producto => {
    const {
        imagen,
        titulo,
        precio,
        cantidad,
        subtotal,
        id /*no interesa para esto*/
    } = producto;
    const row = document.createElement('tr');
    row.className = "text-center align-middle contenidoCarro";
    row.innerHTML = `
            <th class="imgProducto">
                <img src="${imagen}" width="50">
            </th>
            <th>${titulo}</th>            
            <th>${cantidad}</th>
            <th>${precio}</th>
            <th>${formatoMoneda(subtotal)}</th>`;
    // HTML DEL carrito EN EL tbody //
    document.querySelector("#listaCarrito").appendChild(row);
});


function totalGeneral() {
    let productoTotal = carritoConfirmado.reduce((total, producto) => total + producto.subtotal, 0);
    return productoTotal;
}
total.innerHTML = formatoMoneda(totalGeneral());

function formatoMoneda(e) {
    return new Intl.NumberFormat("es-MX", {style: "currency", currency: "MXN"}).format(e);
}

//CREDIT CARD//
$('#card-number').on('keypress change blur', function () {
    $(this).val(function (index, value) {
        return value.replace(/[^a-z0-9]+/gi, '').replace(/(.{4})/g, '$1 ');
    });
});

$('#card-number').on('copy cut paste', function () {
    setTimeout(function () {
        $('#card-number').trigger("change");
    });
});


/* Exp. Date Slash */

$('#card-exp').on('input', function () {
    var curLength = $(this).val().length;
    if (curLength === 2) {
        var newInput = $(this).val();
        newInput += '/';
        $(this).val(newInput);
    }
});

//CREDIT CARD//

//BOTON UNICO PARA AMBOS FORMULARIOS//
$(function () {
    $("#btnFinalizar").click(function (event) {
        event.preventDefault();
        if ($("#nombre").val() === "" || $("#documento").val() === "" || $("#domicilio").val() === "" || $("#numeracion").val() === "" || $("#localidad").val() === "" || $("#numeroTel").val() === "" || $("#email").val() === "") {
            Toastify({
                text: "Complete todos los datos del envío",
                duration: 3500,
                newWindow: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "red",
                    color: "#fff",
                },
            }).showToast();
        } else {
            if ($("#creditCard").is(":checked")) {
                if ($("#card-number").val() === "" || $("#card-name").val() === "" || $("#card-exp").val() === "" || $("#card-cvc").val() === "") {
                    Toastify({
                        text: "Complete todos los datos de la tarjeta",
                        duration: 3500,
                        newWindow: true,
                        gravity: "top", // `top` or `bottom`
                        position: "center", // `left`, `center` or `right`
                        stopOnFocus: true, // Prevents dismissing of toast on hover
                        style: {
                            background: "red",
                            color: "#fff",
                        },
                    }).showToast();
                } else {
                    localStorage.removeItem('carrito');
                    swal({
                            title: "¡Gracias por tu compra!",
                            text: `Tu número de pedido es el: #${numeroPedido(1, 9999)}\n\nTe estaremos enviado un email con los detalles de tu compra\n\nAhora te llevaremos de nuevo a nuestra tienda`,
                            icon: "success",
                        })
                        .then(() => {
                            mandarMail();
                            irTienda();
                        });
                }
            } else if ($("#cash" || "#creditCard").is(":checked")) {
                localStorage.removeItem('carrito');
                swal({
                        title: "¡Gracias por tu compra!",
                        text: `Tu número de pedido es el: # ${numeroPedido(1, 9999)}\n\nTe estaremos enviado un email con los detalles de tu compra\n\nAhora te llevaremos de nuevo a nuestra tienda`,
                        icon: "success",
                    })
                    .then(() => {
                        mandarMail();
                        irTienda();
                    });

            } else {
                Toastify({
                    text: "Seleccione medio de pago",
                    duration: 3500,
                    newWindow: true,
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "red",
                        color: "#fff",
                    },
                }).showToast();
            }
        }
    });
});

$(function () {
    $("#btnCancela").click(function (event) {
        event.preventDefault();
        swal({
                title: "¿Estás seguro que deseas volver a la tienda?",
                text: "Si confirmas, guardaremos tus productos, pero se borraran los datos ingresados",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((confirma) => {
                if (confirma) {
                    irTienda()
                }
            });
    });
});

function irTienda() {
    window.location.href = "./tienda.html";
}

let nroPedido;

function numeroPedido(min, max) {
    return nroPedido = Math.floor(Math.random() * (max - min) + min);
}

function mandarMail() {
    emailjs.send("service_515pt6i", "template_g4c6bnc", {
        from_name: "Roboto Store",
        to_name: document.querySelector("#nombre").value,
        email: document.querySelector("#email").value,
        message: `Hemos recibido tu pedido! El número de seguimiento es: #` + nroPedido + `. Te lo enviaremos a ` + document.querySelector("#domicilio").value + ` Nº ` + document.querySelector("#numeracion").value + `, ` + document.querySelector("#localidad").value + `. Lo estarás recibiendo dentro de los próximos 10 días y el importe total de tu compra es: ` + formatoMoneda(totalGeneral())
    });
}