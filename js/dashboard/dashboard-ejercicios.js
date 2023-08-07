
/********* Carga de los ejercicios *********/

// - Si es profe: puede visualizar, crear, editar o eliminar los ejercicios.
// - Si es alumno: puede visualizar los ejercicios y enviar una nota.

const contenedorDashboard = document.querySelector("#contenedor-dashboard");
const crearBtn = document.querySelector("#crear-btn");
usuarios[indexUs].perfil == "profesor" ? crearBtn.classList.add("visible") : crearBtn.classList.add("oculto");
const ejercicioBoton = document.querySelectorAll(".ejercicio__btn");
const vencimientoBox = document.querySelector(".vencimiento")

function cargarEjercicios() {
    ejercicios.forEach(ejercicio => {
        const fechaVencimiento = DateTime.fromISO(ejercicio.vencimiento);
        const vence = fechaVencimiento < now ? "Venció" : "Vence";
        let imagen = ejercicio.imagen ?? "imagen-falsa.avif"
        imagen = imagen.includes("base64") ? imagen : `../../media/ejercicios/${imagen}`;

        let textRight, textLeft, icon;

        if (usuarios[indexUs].perfil == "profesor") {
            const alumnos = usuarios.filter(usuario => (usuario.perfil == "alumno"));

            textLeft = `Intentos: ${alumnos.filter(alumno => alumno.notas[ejercicio.num].nota !== 0).length} alumnos`;
            textRight = `${vence} el ${fechaVencimiento.toLocaleString()}`;
            Btns = `<button class="ejercicio__edit edit-btn" id="${ejercicio.num}"><ion-icon name="settings"></ion-icon></button>
                    <button class="ejercicio__edit delete-btn" id="${ejercicio.num}"><ion-icon name="trash"></ion-icon></button>`
            icon = `<ion-icon name="eye"></ion-icon>`;

        } else {
            const fechaNota = DateTime.fromISO(usuarios[indexUs].notas[ejercicio.num].fecha);

            textLeft = usuarios[indexUs].notas[ejercicio.num].nota !== 0 ? "Completo" : " Incompleto";
            textRight = `${usuarios[indexUs].notas[ejercicio.num].nota} (${fechaNota.toLocaleString()})`;
            Btns = `<div class="vencimiento ${vence}"><ion-icon name="hourglass"></ion-icon> ${vence} el ${fechaVencimiento.toLocaleString()} </div>`;
            icon = `<ion-icon class="arrow" name="arrow-up"></ion-icon>`;
        }

        contenedorDashboard.innerHTML += `
            <div class = "ejercicio">
                <div class="ejercicio-header">
                    <img src="${imagen}" alt="${ejercicio.titulo}" class="ejercicio__previewimg"></img>
                    <h3 class="ejercicio__titulo"> ${ejercicio.titulo}</h3>
                </div>
                <div class="ejercicio-detalles">
                    <h5 class="ejercicio__text-left"><ion-icon name="checkmark-circle"></ion-icon></ion-icon> ${textLeft}</h5>
                    <h5 class="ejercicio__text-right"><ion-icon name="flag"></ion-icon> ${textRight}</h5>
                </div>
                <div class="ejercicio-footer">
                    <div class="btn-container"> ${Btns} </div>
                    <button class="ejercicio__btn ver" id="${ejercicio.num}">${icon}</button>
                </div>
            </div>
            `;
    })
}


/********* Toma de decisiones según si es profe o no *********/

cargarEjercicios();
visualizarEjercicio();
usuarios[indexUs].perfil == "profesor" && crearEjercicio();
usuarios[indexUs].perfil == "profesor" && editarEliminarEjercicio();


/********* Funciones que rigen la interaccion con el DOM *********/

// VISUALIZACIÓN: Si alumno o profe quiere visualizar ejercicio, guardamos en la sesión cuál eligió para retomarlo en la plataforma

function visualizarEjercicio() {
    const ejercicioBoton = document.querySelectorAll(".ejercicio__btn");
    ejercicioBoton.forEach(boton => {
        boton.addEventListener("click", (e) => {
            if ((DateTime.fromISO(ejercicios[boton.id].vencimiento) < now) && usuarios[indexUs].perfil == "alumno") {
                Swal.fire({
                    title: `Ejercicio vencido`,
                    text: `El ejercicio no puede ser resuelto porque venció`,
                    icon: 'warning',
                    iconColor: '#6a1635',
                    confirmButtonText: 'OK'
                })
            } else {
                sessionStorage.setItem("ejercicioElegido", JSON.stringify(boton.id)); //el id es igual al número de ejercicio
                window.location = "../plataforma.html";
            }
        })
    })
}

// EDITAR O ELIMINAR: 
// - Si el profe quiere eliminar un ejercicio, lo seleccionamos y eliminamos del array de ejercicios y de usuarios.
// - Si el profe quiere editar un ejercicio, guardamos en la sesión CUÁL eligió y que eligió EDITARLO para retomarlo en la pagina de edición/creación.

function editarEliminarEjercicio() {
    const editarBoton = document.querySelectorAll(".ejercicio__edit");
    editarBoton.forEach(boton => {
        boton.addEventListener("click", (e) => {
            sessionStorage.setItem("ejercicioElegido", JSON.stringify(boton.id)); //el id es igual al número de ejercicio
            let btnType = boton.classList.toString()

            if (btnType.includes("delete-btn")) {
                Swal.fire({
                    title: 'Eliminar',
                    text: '¿Estás seguro de eliminar el ejercicio?',
                    icon: 'warning',
                    iconColor: '#6a1635',
                    confirmButtonText: 'Eliminar'
                }).then((result) => {
                    if (result.isConfirmed) {
                        ejercicios.splice(boton.id, 1);
                        usuarios.forEach(usuario => {
                            usuario.notas.splice(boton.id, 1);
                        })
                        actualizarNum();
                        localStorage.setItem("usuariosMV", JSON.stringify(usuarios));
                        localStorage.setItem("ejerciciosMV", JSON.stringify(ejercicios));
                        window.location = "dashboard-ejercicios.html"
                    }
                })

            } else if (btnType.includes("edit-btn")) {
                sessionStorage.setItem("accionEjercicios", JSON.stringify("editar"))
                window.location = "dashboard-crear.html"
            }
        })
    })
}

// CREAR: Guardamos en la sesión que eligió CREAR un ejercicio para retomarlo en la pagina de edición/creación.

function crearEjercicio() {
    const crearBoton = document.querySelector("#crearBtn")
    crearBoton.addEventListener("click", () => {
        sessionStorage.setItem("accionEjercicios", JSON.stringify("crear"))
        window.location = "dashboard-crear.html"
    })
}
