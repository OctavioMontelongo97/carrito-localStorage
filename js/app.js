// variables
const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let articulosCarrito = [];

cargarEventListeners();
function cargarEventListeners() {
    listaCursos.addEventListener('click', agregarCurso);

    // elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    // muestra los cursos de local storage
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    });

    // vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = []; // reinicamos el arreglo
        limpiarHTML();
    });
}

// funciones 
function agregarCurso(event) {
    event.preventDefault();
    if(event.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = event.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
    /*console.log(event.target.classList); 
    Verificar las clases que contiene el elemento
    cuando se le da click*/
}

// leer datos del curso seleccionado
function leerDatosCurso(curso) {
    // console.log(curso);

    // crear un objeto con el contenido del curso actual
    const infoCurso = {
        imagen: curso.querySelector('.imagen-curso').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    // revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some( curso => curso.id === infoCurso.id);
    // console.log(existe);
    if(existe){
        // actualizamos la cantidad
        const cursos = articulosCarrito.map( curso => {
            if(curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // retorna el objeto actualizado
            }
            else {
                return curso; // retorna los objetos que no son duplicados
            }
        });
        articulosCarrito = [...cursos];
    } 
    else {
        // agregamos el curso al carrito
        /* agrega elementos al arreglo de carrito */
        articulosCarrito = [...articulosCarrito, infoCurso];
    }
    // console.log(articulosCarrito);
    carritoHTML();
}

// elimina un curso del carrito
function eliminarCurso(event) {
    if(event.target.classList.contains('borrar-curso')) {
        const cursoId = event.target.getAttribute('data-id');

        // elimina del arreglo aritulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter( (curso) => {
            return curso.id !== cursoId;
        });
        carritoHTML(); // iteramos sobre el carrito y mostramos el html
    }
}

// muestra el carrito en el HTML
function carritoHTML() {
    // limpiar el html 
    limpiarHTML();

    // recorre el carrito y genera el html
    articulosCarrito.forEach( curso => {
        // destructuring object
        const {imagen, titulo, precio, cantidad, id} = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <img src= "${imagen}" width = "100">
            </td>
            <td>
                ${titulo}
            </td>
            <td>
                ${precio}
            </td>
            <td>
                ${cantidad}
            </td>
            <td>
                <a href="#" class="borrar-curso" data-id="${id}"> 
                    X 
                </a>
            </td>
        `; // template string o template literal

        // agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });
    // agregar el carrito de compras al storage
    sincronizarStorage();
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

// elimina los cursos del table body
function limpiarHTML() {
    // forma lenta
    // contenedorCarrito.innerHTML = '';

    while(contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}