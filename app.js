const lista = document.getElementById("lista-tareas");
const input = document.getElementById("input-tarea");
const form = document.getElementById("form-tarea");
const filtros = document.querySelectorAll(".filtro");
const btnDark = document.getElementById("btn-dark");

let tareas = [];

function animar(elemento) {
    elemento.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => {
        elemento.classList.remove("opacity-0", "translate-y-2");
    }, 10);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (input.value.trim() === "") return;

    const nueva = {
        id: Date.now(),
        texto: input.value,
        completada: false
    };

    tareas.push(nueva);
    input.value = "";
    render();
});

function render(filtro = "todas") {
    lista.innerHTML = "";

    let filtradas = tareas;

    if (filtro === "completadas") {
        filtradas = tareas.filter(t => t.completada);
    } else if (filtro === "pendientes") {
        filtradas = tareas.filter(t => !t.completada);
    }

    filtradas.forEach(t => {
        const div = document.createElement("div");

        div.className = `
            tarea flex items-center justify-between p-4 rounded-lg
            bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700
            transition hover:shadow-sm
        `;

        div.innerHTML = `
            <div class="flex items-center gap-3">
                <input type="checkbox" class="w-5 h-5" ${t.completada ? "checked" : ""}>
                <span class="${t.completada ? "line-through text-slate-500" : ""}">
                    ${t.texto}
                </span>
            </div>

            <button class="text-red-500 hover:text-red-700 transition">✖</button>
        `;

        div.querySelector("input").addEventListener("change", () => {
            t.completada = !t.completada;
            render(filtro);
        });

        div.querySelector("button").addEventListener("click", () => {
            tareas = tareas.filter(x => x.id !== t.id);
            render(filtro);
        });

        animar(div);
        lista.appendChild(div);
    });
}

filtros.forEach(f => {
    f.addEventListener("click", () => {
        filtros.forEach(x => x.classList.remove("bg-slate-200", "dark:bg-slate-700"));
        f.classList.add("bg-slate-200", "dark:bg-slate-700");
        render(f.dataset.filter);
    });
});

btnDark.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
});
