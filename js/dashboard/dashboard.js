// Tomamos los usuarios y ejercicios cargados en el localstorage

usuarios = JSON.parse(localStorage.getItem("usuariosMV"));
ejercicios = JSON.parse(localStorage.getItem("ejerciciosMV"));

// No inició sesión -> lo redirigimos a inicio de sesión.

const indexUs = JSON.parse(sessionStorage.getItem("sesionMV"));

if ((usuarios === null) || indexUs === null) {
    Swal.fire({
        title: `Sesión caducada`,
        text: `Volvé a iniciar sesión para acceder`,
        icon: 'warning',
        iconColor: '#6a1635',
        confirmButtonText: 'OK'
    }).then(() => {
        window.location = "../registration.html";
    })
}


/********* Mostramos el menú lateral *********/
// Dependiendo si es profe o alumno el menú de la izquierda cambia un poquito

function mostrarMenuLateral() {
    const menu = document.querySelector("#notas");
    usuarios[indexUs].perfil == "profesor" && (menu.innerHTML = '<ion-icon name="people"></ion-icon> Mis Alumnos');
    const account = document.querySelector(".account-name");
    account.innerHTML = `<ion-icon name="person"></ion-icon> Sesión: ${usuarios[indexUs].nombre}`;
}

// Botón salir del menú, hace que vuelva a la página de registro y elimina la sesión del sessionStorage

function cerrarSesion() {
    const salir = document.querySelector("#salir");
    salir.addEventListener("click", (e) => {
        Swal.fire({
            title: `Salir`,
            text: `¿Estás seguro de que querés cerrar la sesión?`,
            icon: 'warning',
            iconColor: '#6a1635',
            confirmButtonText: 'Salir'
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.removeItem("sesionMV");
                sessionStorage.removeItem("ejercicioElegido");
                sessionStorage.removeItem("accionEjercicios");
                window.location = "../registration.html";
            }
        })

    })
}

// Que el menú lo muestre solo si está en el dashboard, no en la plataforma

window.location.href.includes("dashboard") == true && (mostrarMenuLateral(), cerrarSesion())


/********* Dashboard - inicio *********/
// Sólo si estamos en la página de inicio, le da la bienvenida

if (window.location.href.includes("dashboard-home.html") == true) {
    const bienvenida = document.querySelector("#bienvenida");
    const perfil = document.querySelector("#perfil");

    bienvenida.innerText = `¡Bienvenido al microscopio virtual ${usuarios[indexUs].nombre}! `
    perfil.innerText = `Perfil : ${usuarios[indexUs].perfil}`
}