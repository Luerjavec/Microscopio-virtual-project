// Buscamos si en la pág anterior se eligió crear o editar un ejercicio

const accion = JSON.parse(sessionStorage.getItem("accionEjercicios"));
const numEjer = JSON.parse(sessionStorage.getItem("ejercicioElegido"));
const ejercicio = ejercicios[numEjer]


/********* Interacción con el DOM - parte derecha: Carga de imagen *********/

const elegirImagenBtn = document.querySelector(".choose-img");
const elegirImagenInput = document.querySelector(".file-input");
const previewImg = document.querySelector(".preview-img img");
const crearBtn = document.querySelector("#crear-ejercicio-button");
const crearTitle = document.querySelector("#titulo-principal");

function loadImage() {
    const file = elegirImagenInput.files[0];
    const reader = new FileReader();

    reader.addEventListener("load", (e) => {
        e.preventDefault();
        try {
            sessionStorage.setItem("imagen", reader.result); //contenido del archivo pasado a base64
            previewImg.className = "visible";
            previewImg.src = reader.result;
            
        } catch {
            Swal.fire({
                title: `Sin espacio`,
                text: `No hay espacio para subir más imágenes. Elimine un ejercicio antes de crear uno nuevo`,
                icon: 'warning',
                iconColor: '#6a1635',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) { window.location = "dashboard-ejercicios.html" }
            })
        }
    })

file && reader.readAsDataURL(file);    
}


elegirImagenInput.addEventListener("change", loadImage);
elegirImagenBtn.addEventListener("click", () => elegirImagenInput.click());


/********* Interacción con el DOM - parte de izquierda: formulario *********/

// 1) Guardamos los inputs del formulario en variables

const nuevoTitulo = document.querySelector("#nuevo-titulo");
const nuevaPregunta = document.querySelector("#nueva-pregunta");
const opc1 = document.querySelector("#nueva-opc1");
const opc2 = document.querySelector("#nueva-opc2");
const opc3 = document.querySelector("#nueva-opc3");

// 2) Si está editando el ejercicio, mostramos el formulario ya completo con los datos previos del ejercicio.

function mostrarEditarEjercicio() {
    crearBtn.innerHTML = "Editar ejercicio";
    crearTitle.innerHTML = "Editar ejercicio";
    nuevoTitulo.value = ejercicio.titulo;
    document.querySelector("#nuevo-vencimiento").value = new Date().toISOString().split('T')[0];
    nuevaPregunta.value = ejercicio.preguntas[0].pregunta;
    opc1.value = ejercicio.preguntas[0].opc1;
    opc2.value = ejercicio.preguntas[0].opc2;
    opc3.value = ejercicio.preguntas[0].opc3;
    previewImg.className = "visible";
    previewImg.src = ejercicio.imagen.includes("base64") ? ejercicio.imagen : `../../media/ejercicios/${ejercicio.imagen}`;
}

// 3) Al tocar submit:
//  - Si está editando se edita un objeto existente en el array. Si está creando, se crea un objeto nuevo.
//  - El array modificado sobreescribe en el localstorage

function editarEjercicio() {
    const form = document.querySelector(".crear-form")
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nuevaImagen = sessionStorage.getItem("imagen");
        const fecha = document.querySelector("#nuevo-vencimiento").value;
        const nuevoVencimiento = DateTime.fromISO(fecha);

        ejercicio.titulo = nuevoTitulo.value;
        ejercicio.vencimiento = nuevoVencimiento;
        ejercicio.preguntas[0].pregunta = nuevaPregunta.value;
        ejercicio.preguntas[0].opc1 = opc1.value;
        ejercicio.preguntas[0].opc2 = opc2.value;
        ejercicio.preguntas[0].opc3 = opc3.value;
        ejercicio.imagen = nuevaImagen || ejercicio.imagen;

        localStorage.setItem("ejerciciosMV", JSON.stringify(ejercicios));
        sessionStorage.removeItem('imagen');
        window.location = "dashboard-ejercicios.html";
    });
}

function crearEjercicio() {
    const form = document.querySelector(".crear-form");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const nuevaImagen = sessionStorage.getItem("imagen");
        const fecha = document.querySelector("#nuevo-vencimiento").value;
        const nuevoVencimiento = DateTime.fromISO(fecha);

        ejercicioToArray(nuevoVencimiento, nuevoTitulo.value, nuevaImagen, 0, 100, 100,
            nuevaPregunta.value, opc1.value, opc2.value, opc3.value);

        sessionStorage.removeItem('imagen');
        window.location = "dashboard-ejercicios.html";
    });
}


// Toma de decisiones según si se está editando o creando

accion.includes("editar") && mostrarEditarEjercicio();
accion.includes("editar") ? editarEjercicio() : crearEjercicio();