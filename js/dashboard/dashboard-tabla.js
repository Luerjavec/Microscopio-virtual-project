// Si es profesor: la tabla va a mostrar a los alumnos y promedio + un acordeón con la nota en cada ejercicio.
// Si es alumno: la tabla va a mostrar una lista de los ejercicios y sus notas

const tituloPrincipal = document.querySelector("#titulo-principal");
tituloPrincipal.innerText = usuarios[indexUs].perfil == "profesor" ? "Mis alumnos" : "Mis notas";
const tableHead = document.querySelector("thead");
const tableBody = document.querySelector("tbody");

// Creación dinámica del header de las tablas según si es profe o alumno

let headers = usuarios[indexUs].perfil == "profesor" ? ["#", "Nombre", "Promedio"] : ["#", "Ejercicio", "Nota"];

function crearTabla(headers) {
    const cols = headers;
    let tags = "<tr>";
    for (i = 0; i < cols.length; i++) {
        tags += `<th>${cols[i]}</th>`;
    }
    tags += "</tr>";
    tableHead.innerHTML = tags;
    usuarios[indexUs].perfil == "profesor" ? tableBodyProfe() : tableBodyAlumno();
}

// Creación dinámica del body de las tablas según si es profe o alumno

function tableBodyAlumno() {
    let tags = "";
    ejercicios.map(ej => {
        let nota = usuarios[indexUs].notas[ej.num].nota
        tags += `<tr>
                <td>${ej.num + 1}</td>
                <td class="col-titulo">${ej.titulo}</td>
                <td>${nota || "Incompleto"}</td>
            </tr>`;
    })
    tableBody.innerHTML = tags;
}

function tableBodyProfe() {
    let tags = "";
    usuarios.map(u => {
        const numero = usuarios.findIndex(i => i == u) + 1
        let notas = u.notas.map(n => n.nota)

        let promedio;
        if (u.perfil == "alumno") {
            promedio = notas.reduce((a, b) => a + b, 0) / u.notas.length || "-";
        } else {
            promedio = ""
        }

        let notasDetalle = "";
        for (let i = 0; i < ejercicios.length; i++) {
            notasDetalle += `<p>${i+1}) ${ejercicios[i].titulo}. || Nota: ${notas[i]}`;
        }

        tags += `<tr>
                <td>${numero}</td>
                <td>${u.nombre}</td>
                <td class="col-notas">
                <div class="accordion-item">
                    <h2 class="accordion-header-${u.perfil}" id="panelsStayOpen-heading${numero}">
                        <button class="accordion-button collapsed notas" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${numero}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${numero}">
                            <ion-icon class="more-notas" name="chevron-down"></ion-icon> Promedio: ${promedio}
                        </button>
                    </h2>
                    <div id="panelsStayOpen-collapse${numero}" class="accordion-collapse collapse" aria-labelledby="panelsStayOpen-heading${numero}">
                        <div class="accordion-body">
                            ${notasDetalle}
                        </div>
                    </div>
                </div>
                </td>
            </tr>`;
    })
    tableBody.innerHTML = tags;
}

crearTabla(headers);            