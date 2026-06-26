let bancoPreguntas = [];
let preguntasActuales = [];

async function cargarPreguntas() {

    try {

        const respuesta = await fetch("preguntas.json");
        bancoPreguntas = await respuesta.json();

        mostrarRecord();
        nuevoExamen();

    } catch (error) {

        console.error(error);

        document.getElementById("quiz").innerHTML =
            "<h2>Error al cargar preguntas.json</h2>";
    }
}

function mezclar(array) {

    let copia = [...array];

    for (let i = copia.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [copia[i], copia[j]] = [copia[j], copia[i]];
    }

    return copia;
}

function nuevoExamen() {

    preguntasActuales = mezclar(bancoPreguntas).slice(0, 50);

    const quiz = document.getElementById("quiz");

    quiz.innerHTML = "";

    preguntasActuales.forEach((pregunta, indice) => {

        let opciones = "";

        pregunta.options.forEach((opcion, i) => {

            opciones += `
                <label>
                    <input
                        type="radio"
                        name="pregunta${indice}"
                        value="${i}">
                    ${opcion}
                </label>
            `;
        });

        quiz.innerHTML += `
            <div class="q">

                <b>
                    ${indice + 1}. ${pregunta.question}
                </b>

                ${opciones}

                <div id="resultado-${indice}"></div>

            </div>
        `;
    });

    document.getElementById("resultado").innerHTML = "";
}

function calificar() {

    let correctas = 0;

    preguntasActuales.forEach((pregunta, indice) => {

        const seleccionada =
            document.querySelector(
                `input[name="pregunta${indice}"]:checked`
            );

        const resultado =
            document.getElementById(`resultado-${indice}`);

        if (
            seleccionada &&
            Number(seleccionada.value) === pregunta.answer
        ) {

            correctas++;

            resultado.innerHTML =
                `<p class="ok">✓ Correcta</p>`;

        } else {

            resultado.innerHTML =
                `<p class="bad">
                    ✗ Correcta:
                    ${pregunta.options[pregunta.answer]}
                </p>`;
        }
    });

    const porcentaje =
        ((correctas / preguntasActuales.length) * 100)
        .toFixed(0);

    document.getElementById("resultado").innerHTML = `
        Calificación: ${correctas}/50 (${porcentaje}%)
    `;

    guardarRecord(correctas);
}

function guardarRecord(puntaje) {

    const recordActual =
        Number(localStorage.getItem("record")) || 0;

    if (puntaje > recordActual) {

        localStorage.setItem("record", puntaje);
    }

    mostrarRecord();
}

function mostrarRecord() {

    const record =
        Number(localStorage.getItem("record")) || 0;

    document.getElementById("record").textContent =
        record;
}

cargarPreguntas();
