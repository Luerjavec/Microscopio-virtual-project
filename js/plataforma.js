// Buscamos cuál ejercicio eligió para mostrar la plataforma según ese ejercicio

const numEjer = JSON.parse(sessionStorage.getItem("ejercicioElegido"));
const ejercicio = ejercicios[numEjer]

/********* Carga de la plataforma *********/

// Mostramos la imagen y las preguntas correspondientes al ejercicio elegido.

const imagenEjercicio = document.querySelector("#ejercicio-img-display"); //debe ser global porque la usan casi todas las funciones

function mostrarPlataforma() {
    imagenEjercicio.src = ejercicio.imagen.includes("base64") ? ejercicio.imagen : `../media/ejercicios/${ejercicio.imagen}`;

    $("#macrometricoSlider").roundSlider({  //creación de slider customizado a través de librería round-sliders
        sliderType: "min-range",
        handleShape: "round",
        width: 9,  
        radius: 45,
        value: 120,
        handleSize: "+9",
        startAngle: 92,
        max: 138,
        min: 62,
        lineCap: "round",
        animation: false,
        showTooltip: false,
        editableTooltip: false,
    });
    $.fn.roundSlider.prototype._handleDragDistance = 90;
}

function mostrarPreguntas() {
    const preguntasTitulo = document.querySelector(".subtitulo-plataforma");
    preguntasTitulo.innerText = ejercicio.titulo;

    const preguntasLista = document.querySelector(".preguntas-lista");
    ejercicio.preguntas.forEach(pregunta => {
        preguntasLista.innerHTML += `
        <li>
            <div class="form-group">
                <label>${pregunta.pregunta}</label>
                <select id=pregunta class="form-select">
                    <option value="0">-Elegí la respuesta correcta-</option>
                    <option value="1">${pregunta.opc1}</option>
                    <option value="2">${pregunta.opc2}</option>
                    <option value="3">${pregunta.opc3}</option>
                </select>
            </div>
        </li>
            `;
    })
}

mostrarPlataforma();
mostrarPreguntas();


/********* Funciones que editan las imágenes ante interacción del usuario *********/

// 1) Definimos las variables globales principales con objetos del DOM

const platinaImg = document.querySelector(".microscopio-platina")
const luz = document.querySelector(".microscopio-luz")
const luzdfg = document.querySelector(".microscopio-luzdfg")
const platinaXSlider = document.querySelector("#platinaXSlider")
const platinaYSlider = document.querySelector("#platinaYSlider")
const voltimetroSlider = document.querySelector("#voltimetroSlider");
const diafragmaSlider = document.querySelector("#diafragmaSlider");
const objetivo = document.querySelector("#lenteObjetivo");
const imagenObjetivos = document.querySelector(".microscopio-objetivos");

let platinaX = platinaXSlider.value = 0;
let brightness = voltimetroSlider.value = 30;
let contrast = diafragmaSlider.value = 80;
let zoom = objetivo.value / 4;
let enfoque = 20;


// 2) Creamos funciones que cambien los valores de acuerdo a la interacción con el DOM

function aplicarFiltro() {
    imagenEjercicio.style.filter = `contrast(${contrast}%) brightness(${brightness}%) blur(${enfoque}px)`;
    imagenEjercicio.style.transform = `scale(${zoom})`;
    imagenEjercicio.style.left = parseFloat(platinaXSlider.value) * (objetivo.value / 4) + "px"
    imagenEjercicio.style.top = parseFloat(platinaYSlider.value) * (objetivo.value / 4) + "px"
}
aplicarFiltro(); // Aplicación de filtro inicial para que el enfoque tenga dificultad

function actualizarMicroscopio() {
    platinaImg.style.left = (parseFloat(platinaXSlider.value)) / 20 + (parseFloat(platinaYSlider.value)) / 27 + "px"
    platinaImg.style.top = (($("#macrometricoSlider").roundSlider("option", "value") - 200) / 8) + ((parseFloat(platinaXSlider.value)) / 40) + "px"
    luz.style.opacity = parseFloat(voltimetroSlider.value / 5) + 25 + "%";
    luzdfg.style.opacity = parseFloat(voltimetroSlider.value / 5) - parseFloat(diafragmaSlider.value / 5) + 30 + "%";
    imagenObjetivos.src = `../media/microscopio-obj${objetivo.value}.avif`;
}

function actualizarVistas() {
    brightness = voltimetroSlider.value;
    contrast = diafragmaSlider.value;
    zoom = objetivo.value / 4;
    aplicarFiltro();
    actualizarMicroscopio();
}

// 3) Definimos los event listener

platinaYSlider.addEventListener("input", () => { actualizarVistas(); });
platinaXSlider.addEventListener("input", () => { actualizarVistas(); });
voltimetroSlider.addEventListener("input", () => { actualizarVistas(); });
diafragmaSlider.addEventListener("input", () => { actualizarVistas(); });
objetivo.addEventListener("input", () => { actualizarVistas(); });

$("#macrometricoSlider").roundSlider({      //event listener de la librería round-sliders
    drag: function dragSlider(args) {
        enfoque = (args.value-100) > 0 ? (args.value-100) : (args.value-100) * (-1);
        platinaImg.style.top = ((parseFloat(args.value) - 100) / 10) + ((parseFloat(platinaXSlider.value) + 0) / 40) + "px";
        actualizarVistas();
    }
});



/********* Funciones que dan notas *********/

// La nota final sale del promedio del enfoque y la pregunta contestada por el alumno

function darNotaEnfoque() {
    //Defino rubrica aprobación, el valor es la nota y el índex del array es cuánto se alejó el usuario del valor ideal.
    const rubricaNotas = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]

    let difVoltimetroIdeal = Math.round((ejercicio.voltimetro - voltimetroSlider.value) / 10); //(la nota baja 1 pto cada 10 unidades que se aleja)
    difVoltimetroIdeal < 0 && (difVoltimetroIdeal = difVoltimetroIdeal * (-1))

    let difDiafragmaIdeal = Math.round((ejercicio.diafragma - diafragmaSlider.value) / 10); //(la nota baja 1 pto cada 10 unidades que se aleja)
    difDiafragmaIdeal < 0 && (difDiafragmaIdeal = difDiafragmaIdeal * (-1))

    let difMacrometricoIdeal = Math.round(ejercicio.enfoque - (parseFloat($("#macrometricoSlider").roundSlider("option", "value")-100))); //(la nota baja 1 pto cada 1 unidad que se aleja)
    difMacrometricoIdeal < 0 && (difMacrometricoIdeal = difMacrometricoIdeal * (-1));

    let notaVoltimetro = rubricaNotas[difVoltimetroIdeal] || 0;
    let notaDiafragma = rubricaNotas[difDiafragmaIdeal] || 0;
    let notaMacrometrico = rubricaNotas[difMacrometricoIdeal] || 0;

    return Math.round((notaVoltimetro + notaDiafragma + notaMacrometrico) / 3);
}

function darNotaPreguntas() {
    const opcion = document.querySelector("#pregunta"); //la opción correcta siempre es la 1
    let notaPreguntas = opcion.value == 1 ? 10 : 0;
    return notaPreguntas;
}

// Obtenemos la nota y fecha y la guardamos en las notas del usuario en el LocalStorage. Luego redirige al dashboard de ejercicios

function notaToArray() {
    const respuesta = document.querySelector(".preguntas-form")
    respuesta.addEventListener("submit", (e) => {
        e.preventDefault();
        let notaEnfoque = darNotaEnfoque();
        let notaPreguntas = darNotaPreguntas();
        
        let notaFinal = Math.round((notaEnfoque + notaPreguntas) / 2);
        let fecha = now;
        const nuevaNota = new Nota(notaFinal, fecha);

        usuarios[indexUs].perfil == "alumno" && usuarios[indexUs].notas.splice(numEjer, 1, nuevaNota);
        localStorage.setItem("usuariosMV", JSON.stringify(usuarios));

        Swal.fire({
            title: `${notaFinal}`,
            text: `Nota enfoque: ${notaEnfoque}, Nota pregunta: ${notaPreguntas}. Nota final : ${notaFinal}`,
            icon: 'success',
            iconColor: '#0a5124',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location = "./dashboard/dashboard-ejercicios.html";
            }
        })
    });
}

notaToArray();