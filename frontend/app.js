const API_URL = 'http://localhost:3000/api/cursos';

const contenedorTarjetas = document.getElementById('contenedor-tarjetas');
const formCurso = document.getElementById('form-curso');
const mensajeAlerta = document.getElementById('mensaje-alerta');
const btnFiltroTodos = document.getElementById('btn-filtro-todos');
const btnFiltroActivos = document.getElementById('btn-filtro-activos');

let todosLosCursos = []; 

document.addEventListener('DOMContentLoaded', () => {
    obtenerCursos();
    setupFiltros();
});

function mostrarMensaje(texto, tipo) {
    mensajeAlerta.innerText = texto;
    mensajeAlerta.className = `alerta ${tipo}`;
    setTimeout(() => {
        mensajeAlerta.className = 'alerta hidden';
    }, 4000);
}


async function obtenerCursos() {
    try {
        const respuesta = await fetch(API_URL);
        if (!respuesta.ok) throw new Error('No se pudo conectar con el servidor.');
        todosLosCursos = await respuesta.json();
        renderizarTarjetas(todosLosCursos);
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

function renderizarTarjetas(cursos) {
    contenedorTarjetas.innerHTML = '';

    if (cursos.length === 0) {
        contenedorTarjetas.innerHTML = '<p>No hay cursos disponibles para mostrar.</p>';
        return;
    }

    cursos.forEach(curso => {
        const tarjeta = document.createElement('div');
       
        const claseEstado = curso.Activo ? 'curso-activo' : 'curso-inactivo';
        tarjeta.className = `card ${claseEstado}`;

        tarjeta.innerHTML = `
            <span class="status-badge">${curso.Activo ? 'Activo' : 'Inactivo'}</span>
            <h3>${curso.Nombre}</h3>
            <p><strong>Categoría:</strong> ${curso.Categoria}</p>
            <p><strong>Duración:</strong> ${curso.Duracion} hs</p>
            <p><strong>Cupos Restantes:</strong> ${curso.CuposDisponibles}</p>
            <button class="btn-delete" data-id="${curso.Id}">Eliminar Curso</button>
        `;

        const btnEliminar = tarjeta.querySelector('.btn-delete');
        btnEliminar.addEventListener('click', () => eliminarCurso(curso.Id));

        contenedorTarjetas.appendChild(tarjeta);
    });
}

formCurso.addEventListener('submit', async (e) => {
    e.preventDefault();

    
    const Nombre = document.getElementById('nombre').value.trim();
    const Categoria = document.getElementById('categoria').value.trim();
    const Duracion = parseInt(document.getElementById('duracion').value);
    const CuposDisponibles = parseInt(document.getElementById('cupos').value);
    const Activo = document.getElementById('activo').checked;

    const nuevoCurso = { Nombre, Categoria, Duracion, CuposDisponibles, Activo };

    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoCurso)
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            mostrarMensaje(data.message, 'exito');
            formCurso.reset();
            obtenerCursos();   
        } else {
            throw new Error(data.message || 'Error al guardar el curso');
        }
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
});

async function eliminarCurso(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este curso?')) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        const data = await respuesta.json();

        if (respuesta.ok) {
            mostrarMensaje(data.message, 'exito');
            obtenerCursos();
        } else {
            throw new Error(data.message || 'Error al eliminar el curso');
        }
    } catch (error) {
        mostrarMensaje(error.message, 'error');
    }
}

function setupFiltros() {
    btnFiltroTodos.addEventListener('click', () => {
        btnFiltroTodos.classList.add('active');
        btnFiltroActivos.classList.remove('active');
        renderizarTarjetas(todosLosCursos);
    });

    btnFiltroActivos.addEventListener('click', () => {
        btnFiltroActivos.classList.add('active');
        btnFiltroTodos.classList.remove('active');
        const filtrados = todosLosCursos.filter(c => c.Activo === true || c.Activo === 1);
        renderizarTarjetas(filtrados);
    });
}