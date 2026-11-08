//datos de entrada
let inventario = [
    { id: 1, nombre: "computadoras-", categoria: "electrónica", cantidad: 5, precio: 100.0, agotado: false },
    { id: 2, nombre: "Ropero", categoria: "muebles", cantidad: 5, precio: 70.00, agotado: false },
    { id: 3, nombre: "Cargadores", categoria: "electrónica", cantidad: 0, precio: 6.00, agotado: true },
    { id: 4, nombre: "Vestidos", categoria: "ropa", cantidad: 3, precio: 15.99, agotado: false },
    { id: 5, nombre: "snaks", categoria: "alimentos", cantidad: 0, precio: 1.50, agotado: true },
    { id: 6, nombre: "Guante de cocina", categoria: "accesorios", cantidad: 8, precio: 25.99, agotado: false },
    { id: 7, nombre: "Tostadora", categoria: "electrodoméstico", cantidad: 2, precio: 99.99, agotado: false },
    { id: 8, nombre: "Refresco", categoria: "alimentos", cantidad: 0, precio: 2.00, agotado: true },
];

function crearGeneradorId() {
    let contador = 100;
    return function () {
        contador++;
        return contador;
    }
}

function calcularValorTotal(items) {
    let acumulador = 0;
    for (let i = 0; i < items.length; i++) {
        acumulador += items[i].cantidad * items[i].precio;
    }
    return acumulador;
}

function contarUnidades(items) {
    let acumulador = 0;
    for (let i = 0; i < items.length; i++) {
        acumulador += items[i].cantidad;
    }
    return acumulador;
}

function contarPorCategoria(items) {
    const conteo = {};
    for (let i = 0; i < items.length; i++) {
        const cat = items[i].categoria;
        if (conteo[cat]) {
            conteo[cat]++;
        } else {
            conteo[cat] = 1;
        }
    }
    return conteo;
}

function crearCelda(texto) {
    const td = document.createElement("td");
    td.textContent = texto;
    return td;
}

function crearFila(item) {
    const tr = document.createElement("tr");
    tr.appendChild(crearCelda(item.nombre));
    tr.appendChild(crearCelda(item.categoria));
    tr.appendChild(crearCelda(item.cantidad));
    tr.appendChild(crearCelda(`${item.precio.toFixed(2)}`));

    const subtotal = item.cantidad * item.precio;
    tr.appendChild(crearCelda(`${subtotal.toFixed(2)}`));
    tr.appendChild(crearCelda(item.agotado ? "Agotado" : "Disponible"));

    const tdAcciones = document.createElement("td");

    const botonEstado = document.createElement("button");
    botonEstado.textContent = item.agotado ? "Marcar Disponible" : "Marcar Agotado";
    botonEstado.className = "btn-estado";

    botonEstado.setAttribute("data-id", item.id);

    const botonEliminar = document.createElement("button");
    botonEliminar.textContent = "Eliminar";
    botonEliminar.className = "btn-eliminar";

    botonEliminar.setAttribute("data-id", item.id);
    tdAcciones.appendChild(botonEstado);
    tdAcciones.appendChild(botonEliminar);
    tr.appendChild(tdAcciones);

    return tr;
}
function renderizar(items) {
    const cuerpoTabla = document.getElementById("cuerpo-inventario");
    cuerpoTabla.innerHTML = "";

    for (let i = 0; i < items.length; i++) {
        const fila = crearFila(items[i]);
        cuerpoTabla.appendChild(fila);
    }

    document.getElementById("total-productos").textContent = items.length;
    document.getElementById("total-unidades").textContent = contarUnidades(items);
    document.getElementById("valor-total").textContent = calcularValorTotal(items).toFixed(2);

    let agotados = 0;
    for (let i = 0; i < items.length; i++) {
        if (items[i].agotado) {
            agotados++;
        }
    }
    document.getElementById("total-agotados").textContent = agotados;

    const mensajeVacio = document.getElementById("mensaje-vacio");
    if (items.length === 0) {
        mensajeVacio.classList.remove("oculto");
    } else {
        mensajeVacio.classList.add("oculto");
    }
}

function filtrarPorCategoria(categoria) {
    if (categoria === "todas") {
        return inventario;
    }
    const resultado = [];
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].categoria === categoria) {
            resultado.push(inventario[i]);
        }
    }
    return resultado;
}
function validarProducto(datos) {
    if (!datos.nombre || datos.nombre.trim() === "") {
        throw new Error("El nombre no puede estar vacío.");
    }
    if (!datos.categoria || datos.categoria.trim() === "") {
        throw new Error("La categoría no puede estar vacía.");
    }
    if (isNaN(datos.cantidad) || datos.cantidad < 0) {
        throw new Error("La cantidad debe ser un entero mayor o igual a cero.");
    }
    if (isNaN(datos.precio) || datos.precio < 0) {
        throw new Error("El precio debe ser un número mayor o igual a cero.");
    }
}
function agregarProducto(event) {
    event.preventDefault();
    const mensajeError = document.getElementById("mensaje-error");
    mensajeError.classList.add("oculto");
    mensajeError.textContent = "";

    const nombre = document.getElementById("nombre").value;
    const categoria = document.getElementById("categoria").value;
    const cantidad = parseInt(document.getElementById("cantidad").value, 10);
    const precio = parseFloat(document.getElementById("precio").value);

    const datos = { nombre, categoria, cantidad, precio };

    try {
        validarProducto(datos);

        const nuevoProducto = {
            id: obtenerSiguienteId(),
            nombre: datos.nombre.trim(),
            categoria: datos.categoria.trim(),
            cantidad: datos.cantidad,
            precio: datos.precio,
            agotado: datos.cantidad = 0
        };

        inventario.push(nuevoProducto);

        console.log("Alta de producto exitosa:", nuevoProducto);

        actualizarSelectorCategorias();
        renderizar(filtrarPorCategoria(document.getElementById("filtro-categoria").value));

        document.getElementById("formulario-producto").reset();
    } catch (error) {
        console.error(error.message);
        mensajeError.textContent = error.message;
        mensajeError.classList.remove("oculto");
    }
}

function eliminarproducto(id) {
    const nuevoInventario = [];
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].id !== id) {
            nuevoInventario.push(inventario[i]);
        }
    }
    inventario = nuevoInventario;
    console.log(`Producto con ID ${id} eliminado.`);
    return inventario;
}
function cambiarEstado(id) {
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].id === id) {
            inventario[i].agotado = !inventario[i].agotado;
            console.log(`Estado del producto con ID ${id} cambiado a agotado = ${inventario[i].agotado}`);
            break;
        }
    }
}
function actualizarSelectorCategorias() {
    const selector = document.getElementById("filtro-categoria");
    const valorSeleccionado = selector.value;
    selector.innerHTML = '<option value="todas">Todas</option>';

    const categoriasVistas = [];
    for (let i = 0; i < inventario.length; i++) {
        const cat = inventario[i].categoria;
        let existe = false;
        for (let j = 0; j < categoriasVistas.length; j++) {
            if (categoriasVistas[j] === cat) {
                existe = true;
                break;
            }
        }
        if (!existe) {
            categoriasVistas.push(cat);
            const option = document.createElement("option");
            option.value = cat;
            option.textContent = cat;
            selector.appendChild(option);
        }
    }
    selector.value = valorSeleccionado;
}
document.addEventListener("DOMContentLoaded", function () {

    const generador = crearGeneradorId();

    let maxId = 107;
    for (let i = 0; i < inventario.length; i++) {
        if (inventario[i].id > maxId) maxId = inventario[i].id;
    }
    let idActual = maxId;
    obtenerSiguienteId = function () {
        idActual++;
        return idActual;
    };
    document.getElementById("formulario-producto").addEventListener("submit", agregarProducto);

    document.getElementById("cuerpo-inventario").addEventListener("click", function (event) {
        const objetivo = event.target;
        if (objetivo.classList.contains("btn-eliminar")) {
            const id = parseInt(objetivo.getAttribute("data-id"), 10);
            eliminarproducto(id);
            actualizarSelectorCategorias();
            renderizar(filtrarPorCategoria(document.getElementById("filtro-categoria").value));
            console.table(inventario);
        } else if (objetivo.classList.contains("btn-estado")) {
            const id = parseInt(objetivo.getAttribute("data-id"), 10);
            cambiarEstado(id);
            renderizar(filtrarPorCategoria(document.getElementById("filtro-categoria").value));
            console.table(inventario);
        }
    });
    document.getElementById("filtro-categoria").addEventListener("change", function (event) {
        const categoriaSeleccionada = event.target.value;
        const inventarioFiltrado = filtrarPorCategoria(categoriaSeleccionada);
        renderizar(inventarioFiltrado);
    });

    console.table
    console.table(inventario);
    console.table(contarPorCategoria(inventario));
});

