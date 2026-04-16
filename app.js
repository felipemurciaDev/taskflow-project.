const lista = document.getElementById("lista-tareas");
const input = document.getElementById("input-tarea");
const form = document.getElementById("form-tarea");
const filtros = document.querySelectorAll(".filtro");
const btnDark = document.getElementById("btn-dark");
const inputBusqueda = document.getElementById("input-busqueda");
const btnOrden = document.getElementById("btn-orden");

let tareas = JSON.parse(localStorage.getItem('tareas_retro')) || [];
let filtroActual = "todas";
let ordenAsc = true;

function sincronizarEmoji() {
    btnDark.innerText = document.documentElement.classList.contains("dark") ? "☀️" : "🌙";
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim() === "") return;
    tareas.push({ id: Date.now(), texto: input.value, completada: false });
    input.value = "";
    guardarYRender();
});

function render() {
    lista.innerHTML = "";
    let filtradas = [...tareas];

    if (filtroActual === "completadas") filtradas = filtradas.filter(t => t.completada);
    else if (filtroActual === "pendientes") filtradas = filtradas.filter(t => !t.completada);

    const busqueda = inputBusqueda.value.toLowerCase();
    if (busqueda) filtradas = filtradas.filter(t => t.texto.toLowerCase().includes(busqueda));

    filtradas.sort((a, b) => ordenAsc ? a.texto.localeCompare(b.texto) : b.texto.localeCompare(a.texto));

    filtradas.forEach(t => {
        const div = document.createElement("div");
        div.className = `task-enter flex items-center justify-between p-3 border-4 border-black dark:border-white shadow-retro dark:shadow-retro-dark ${t.completada ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'}`;
        div.innerHTML = `
            <div class="flex items-center gap-3 flex-1 overflow-hidden">
                <input type="checkbox" class="w-5 h-5 border-2 border-black cursor-pointer accent-black" ${t.completada ? "checked" : ""}>
                <span contenteditable="true" class="font-bold text-sm md:text-base outline-none truncate w-full ${t.completada ? "line-through opacity-50" : ""}">
                    ${t.texto}
                </span>
            </div>
            <button class="btn-retro bg-red-400 border-2 border-black ml-3 px-2 py-0.5 text-xs font-black shadow-[2px_2px_0px_0px_black]">X</button>
        `;

        div.querySelector("input").addEventListener("change", () => {
            t.completada = !t.completada;
            guardarYRender();
        });

        const span = div.querySelector("span");
        span.addEventListener("blur", () => {
            if(span.innerText.trim() !== "") {
                t.texto = span.innerText;
                guardarYRender();
            } else span.innerText = t.texto;
        });
        
        span.addEventListener("keydown", (e) => { 
            if(e.key === "Enter") { e.preventDefault(); span.blur(); } 
        });

        div.querySelector("button").addEventListener("click", () => {
            tareas = tareas.filter(x => x.id !== t.id);
            guardarYRender();
        });
        lista.appendChild(div);
    });
}

filtros.forEach(f => {
    f.addEventListener("click", () => {
        filtros.forEach(x => {
            x.classList.remove("bg-retro-green", "text-black");
            x.classList.add("bg-white", "dark:bg-gray-800");
        });
        f.classList.remove("bg-white", "dark:bg-gray-800");
        f.classList.add("bg-retro-green", "text-black");
        filtroActual = f.dataset.filter;
        render();
    });
});

inputBusqueda.addEventListener("input", render);

btnOrden.addEventListener("click", () => {
    ordenAsc = !ordenAsc;
    btnOrden.innerText = ordenAsc ? "A-Z ↑" : "Z-A ↓";
    render();
});

btnDark.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    btnDark.innerText = isDark ? "☀️" : "🌙";
    localStorage.setItem('tema', isDark ? 'dark' : 'light');
});

function guardarYRender() {
    localStorage.setItem('tareas_retro', JSON.stringify(tareas));
    render();
}

if (localStorage.getItem('tema') === 'dark') document.documentElement.classList.add('dark');
sincronizarEmoji();
render();