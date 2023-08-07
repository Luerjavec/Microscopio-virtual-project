// Animaciones intercambiantes formulario inicio de sesión vs. olvide contraseña vs. crear cuenta

const registrationContainer = document.querySelector(".registration-container");
const olvidarLink = document.querySelector(".olvidar-link");
const loginLink = document.querySelector(".login-link");
const loginBackLink = document.querySelector(".login-back-link");
const registerLink = document.querySelector(".register-link");

registerLink.addEventListener("click", () => {
    registrationContainer.classList.add("registrarse");
});
loginLink.addEventListener("click", (e) => {
    e.preventDefault()
    registrationContainer.classList.remove("registrarse");
});
olvidarLink.addEventListener("click", () => {
    registrationContainer.classList.add("olvidar");
});
loginBackLink.addEventListener("click", (e) => {
    e.preventDefault()
    registrationContainer.classList.remove("olvidar");
});


/********* Interaccion con el DOM para iniciar sesión o para registrarse *********/

const loginForm = document.querySelector(".login-form");
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    iniciarSesion();
});

const btnRegister = document.querySelector("#register-button");
const registerForm = document.querySelector(".register-form");
registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    btnRegister.innerText = 'Registrando...';
    confirmacionEmail();
    crearCuenta();
});

const btnOlvidar = document.querySelector("#olvidar-button");
const olvidarForm = document.querySelector(".olvidar-form");
olvidarForm.addEventListener("submit", function (e) {
    e.preventDefault();
    btnOlvidar.innerText = 'Enviando código...';
    recuperarContraseña();
});


/********* Funciones que manejan el inicio de sesión, registro y olvido de contraseña *********/

// 1) Contraseña olvidada: Si el email estaba registrado, crea una contraseña random, se la envía por mail y la cambia en el array.

let randomPassword = 0;

function recuperarContraseña() {
    const olvidarMail = document.querySelector("#olvidar-mail").value.toLowerCase();
    const usuarioExists = usuarios.some(u => u.email == olvidarMail);

    if (usuarioExists == false) {
        Swal.fire({
            title: `Mail no registrado`,
            text: `El mail ${olvidarMail} no se encuentra registrado`,
            icon: 'warning',
            iconColor: '#6a1635',
            confirmButtonText: 'OK'
        })
    } else {
        randomPassword = Math.random().toString(36).slice(2, 10);
        const indexUs = usuarios.findIndex(u => u.email == olvidarMail);
        usuarios[indexUs].password = randomPassword;
        localStorage.setItem("usuariosMV", JSON.stringify(usuarios));
        recuperacionEmail();
    }
};

function recuperacionEmail() {
    const mailRecuperar = document.querySelector("#register-user").value.toLowerCase();
    const templateParams = { olvidarMail: mailRecuperar, newPassword: randomPassword };
    const serviceID = 'default_service';
    const templateID = 'template_y06zeh9';

    emailjs.send(serviceID, templateID, templateParams)
        .then(() => {
            Swal.fire({
                title: `Código enviado`,
                text: `Listo! Te enviamos un mail con un código para recuperar tu contraseña`,
                icon: 'success',
                iconColor: '#0a5124',
                confirmButtonText: 'OK'
            }).then(result => {
                if (result.isConfirmed) {
                    olvidarForm.reset();
                }
            })
            btnOlvidar.innerText = 'Recuperar contraseña';
        }, (err) => {
            btnOlvidar.innerText = 'Recuperar contraseña';
            Swal.fire({
                title: `Error`,
                text: `Ocurrió un error. Intenta de nuevo más tarde.`,
                icon: 'error',
                iconColor: 'red',
                confirmButtonText: 'OK'
            })
        });
}


// 2) Crear usuario: Crea un usuario, lo guarda en array de usuarios y envía un mail de confirmación.

function confirmacionEmail() {
    const serviceID = 'default_service';
    const templateID = 'template_egkspow';

    emailjs.sendForm(serviceID, templateID, registerForm)
        .then(() => {
            btnRegister.innerText = 'Registrarme';
        }, (err) => {
            btnRegister.innerText = 'Registrarme';
            Swal.fire({
                title: `Error`,
                text: `Ocurrió un error, por favor intenta de nuevo más tarde`,
                icon: 'error',
                iconColor: 'red',
                confirmButtonText: 'OK'
            })
        });
}

function crearCuenta() {
    const registerNombre = document.querySelector("#register-user").value.toLowerCase();
    const registerMail = document.querySelector("#register-mail").value.toLowerCase();
    const registerPassword = document.querySelector("#register-password").value;
    const registerPerfil = document.querySelector('input[name=perfil]:checked').value;

    if ((usuarios.some(u => u.email == registerMail.toLowerCase())) == true) {
        Swal.fire({
            title: `Mail existente`,
            text: `El mail ${registerMail} ya se encuentra registrado`,
            icon: 'warning',
            iconColor: '#6a1635',
            confirmButtonText: 'OK'
        })
    } else {
        usuarioToArray(registerPerfil, registerNombre, registerMail, registerPassword);
        Swal.fire({
            title: `Cuenta creada`,
            text: `Listo ${registerNombre}, ya podés usar tu cuenta para iniciar sesión. Te enviamos un mail de bienvenida`,
            icon: 'success',
            iconColor: '#0a5124',
            confirmButtonText: 'OK'
        }).then(result => {
            if (result.isConfirmed) {
                registerForm.reset();
            }
        })
    }
};

// 3) Iniciar sesión: Si el usuario y contraseña son correctas, inicia sesión y guarda usuario para recuperarlo en dashboard

function iniciarSesion() {
    const loginMail = document.querySelector("#login-mail").value;
    const loginPassword = document.querySelector("#login-password").value;
    let userExists = (usuarios.some(u => u.email == loginMail.toLowerCase()));
    let indexUs = usuarios.findIndex(u => u.email == loginMail.toLowerCase());

    if (userExists == true && usuarios[indexUs].password == loginPassword) {
        sessionStorage.setItem("sesionMV", JSON.stringify(indexUs)); 
        window.location = "./dashboard/dashboard-home.html";
    } else {
        Swal.fire({
            title: 'Datos incorrectos',
            icon: 'error',
            iconColor: '#6a1635',
            confirmButtonText: 'OK'
        })
    }
};