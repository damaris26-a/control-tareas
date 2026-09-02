// 1. SELECTORES DE ELEMENTOS DEL DOM
const form = document.getElementById('form-tarea');
const inputId = document.getElementById('id-tarea');
const inputTitulo = document.getElementById('titulo');
const inputFecha = document.getElementById('fecha');
const inputPrioridad = document.getElementById('prioridad');
const btnGuardar = document.getElementById('btn-guardar');
const tablaTareas = document.getElementById('tabla-tareas');

// 2. LEER: Obtener tareas de LocalStorage al iniciar (si no hay, inicia vacío)
let tareas = JSON.parse(localStorage.getItem('tareas')) || [];

// 3. MOSTRAR (Leer e Inyectar en la interfaz)
function mostrarTareas() {
    // Limpiamos la tabla para evitar duplicados al renderizar
    tablaTareas.innerHTML = '';
    
    tareas.forEach((tarea, index) => {
        // Asignamos una clase CSS según el nivel de prioridad
        let clasePrioridad = 'badge-baja';
        if (tarea.prioridad === 'Alta') clasePrioridad = 'badge-alta';
        if (tarea.prioridad === 'Media') clasePrioridad = 'badge-media';

        // Insertamos la fila en la tabla con los botones correspondientes
        tablaTareas.innerHTML += `
            <tr>
                <td>
                    <input type="checkbox" ${tarea.completada ? 'checked' : ''} onclick="alternarEstado(${index})">
                </td>
                <td class="${tarea.completada ? 'completada' : ''}">${tarea.titulo}</td>
                <td>${tarea.fecha}</td>
                <td><span class="badge ${clasePrioridad}">${tarea.prioridad}</span></td>
                <td>
                    <button class="btn-editar" onclick="cargarFormulario(${index})">✏️</button>
                    <button class="btn-eliminar" onclick="eliminarTarea(${index})">🗑️</button>
                </td>
            </tr>
        `;
    });
}

// 4. PROCESAR FORMULARIO: CREAR Y ACTUALIZAR
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitamos que la página se recargue
    
    const id = inputId.value;
    const nuevaTarea = {
        titulo: inputTitulo.value,
        fecha: inputFecha.value,
        prioridad: inputPrioridad.value,
        completada: id !== '' ? tareas[id].completada : false // Mantiene el estado al editar
    };

    if (id === '') {
        // ACCIÓN: CREAR (Si el ID oculto está vacío, es una nueva tarea)
        tareas.push(nuevaTarea);
    } else {
        // ACCIÓN: ACTUALIZAR (Si hay un ID, reemplaza los datos existentes)
        tareas[id] = nuevaTarea;
        inputId.value = '';
        btnGuardar.textContent = 'Agregar';
        btnGuardar.style.background = '#28a745';
    }

    guardarYRefrescar();
    form.reset(); // Resetea los campos del formulario
});

// 5. CARGAR DATOS EN EL FORMULARIO (Preparar para Actualizar)
function cargarFormulario(index) {
    inputId.value = index; // Guardamos el índice en el input oculto
    inputTitulo.value = tareas[index].titulo;
    inputFecha.value = tareas[index].fecha;
    inputPrioridad.value = tareas[index].prioridad;
    
    // Cambiamos el estilo del botón para avisar que está editando
    btnGuardar.textContent = 'Actualizar';
    btnGuardar.style.background = '#007BFF';
}

// 6. ACCIÓN: ELIMINAR
function eliminarTarea(index) {
    if (confirm('¿Seguro que deseas eliminar esta tarea?')) {
        tareas.splice(index, 1); // Remueve el elemento del arreglo
        guardarYRefrescar();
    }
}

// 7. CAMBIAR ESTADO (Completada / Pendiente)
function alternarEstado(index) {
    tareas[index].completada = !tareas[index].completada;
    guardarYRefrescar();
}

// 8. GUARDAR EN DISCO (LocalStorage) Y ACTUALIZAR VISTA
function guardarYRefrescar() {
    localStorage.setItem('tareas', JSON.stringify(tareas));
    mostrarTareas();
}

// Ejecución inicial: Muestra las tareas guardadas al abrir la página
mostrarTareas();
