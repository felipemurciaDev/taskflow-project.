document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('mi Gestor de tareas');
    const entradaTarea = document.getElementById('entrada-tarea');
    const listaTareas = document.getElementById('lista-tareas');
    
    const btnTodas = document.getElementById('btn-todas');
    const btnPendientes = document.getElementById('btn-pendientes');
    const btnCompletadas = document.getElementById('btn-completadas');
    
    const btnDarkMode = document.getElementById('btn-dark-mode');

    btnDarkMode.addEventListener('click', () => {

        document.documentElement.classList.toggle('dark');
        
        if (document.documentElement.classList.contains('dark')) {
            btnDarkMode.textContent = '☀️ Modo Claro';
        } else {
            btnDarkMode.textContent = '🌙 Modo Oscuro';
        }
    });

    let arrayTareas = [];
    cargarDesdeLocalStorage();

    function guardarEnLocalStorage() {
        localStorage.setItem('misTareas', JSON.stringify(arrayTareas));
    }

    function cargarDesdeLocalStorage() {
        const tareasGuardadas = localStorage.getItem('misTareas');
        if (tareasGuardadas) {
            arrayTareas = JSON.parse(tareasGuardadas);
            renderizarTareas();
        }
    }

    function renderizarTareas() {
        listaTareas.innerHTML = ''; 
        
        arrayTareas.forEach((tarea) => {
            const estadoTexto = tarea.completada ? 'Completado' : 'Por hacer';
            const claseCompletada = tarea.completada ? 'opacity-60 completada' : '';
            const checkeado = tarea.completada ? 'checked' : '';
            const textoTachado = tarea.completada ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-slate-100';

            const tareaHTML = `
                <div class="task-card flex flex-col sm:flex-row justify-between sm:items-center bg-white dark:bg-slate-800 p-4 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300
                 ${claseCompletada}" data-id="${tarea.id}">
                    <div class="flex flex-col gap-1 mb-3 sm:mb-0">
                        <h3 class="text-lg font-semibold task-title ${textoTachado}">${tarea.texto}</h3>
                        <span class="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">General</span>
                    </div>
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                            <span class="estado-texto">${estadoTexto}</span>
                            <label class="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" class="sr-only peer toggle-estado" ${checkeado}>
                                <div class="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['']
                                 after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300
                                 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                        <button class="btn-eliminar bg-red-500 hover:bg-red-600 text-white font-bold py-1.5 px-3 rounded text-sm transition">Eliminar</button>
                    </div>
                </div>
            `;
            listaTareas.insertAdjacentHTML('beforeend', tareaHTML);
        });
    }

    formulario.addEventListener('submit', (event) => {
        event.preventDefault(); 
        const textoTarea = entradaTarea.value.trim();
        if (textoTarea === '') return; 

        const nuevaTarea = {
            id: Date.now(),
            texto: textoTarea,
            completada: false
        };
        
        arrayTareas.push(nuevaTarea);
        guardarEnLocalStorage(); 
        renderizarTareas(); 
        entradaTarea.value = ''; 
    });

    listaTareas.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-eliminar')) {
            const card = event.target.closest('.task-card');
            const idTarea = parseInt(card.getAttribute('data-id'));
            arrayTareas = arrayTareas.filter(tarea => tarea.id !== idTarea);
            guardarEnLocalStorage(); 
            renderizarTareas(); 
        }
    });

    listaTareas.addEventListener('change', (event) => {
        if (event.target.classList.contains('toggle-estado')) {
            const card = event.target.closest('.task-card');
            const idTarea = parseInt(card.getAttribute('data-id'));
            const tareaModificar = arrayTareas.find(tarea => tarea.id === idTarea);
            if (tareaModificar) {
                tareaModificar.completada = event.target.checked;
                guardarEnLocalStorage(); 
                renderizarTareas(); 
            }
        }
    });

    function filtrarTareas(filtro) {
        const tareasDOM = listaTareas.querySelectorAll('.task-card');
        
        tareasDOM.forEach(tarea => {
            const estaCompletada = tarea.classList.contains('completada');
            tarea.classList.remove('hidden'); 

            if (filtro === 'pendientes' && estaCompletada) {
                tarea.classList.add('hidden');
            } 
            else if (filtro === 'completadas' && !estaCompletada) {
                tarea.classList.add('hidden');
            }
        });
    }

    if (btnTodas) btnTodas.addEventListener('click', () => filtrarTareas('todas'));
    if (btnPendientes) btnPendientes.addEventListener('click', () => filtrarTareas('pendientes'));
    if (btnCompletadas) btnCompletadas.addEventListener('click', () => filtrarTareas('completadas'));
});