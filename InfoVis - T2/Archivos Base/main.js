// El archivO incluye reproducción de música. 
// Al final se explica como apagarlo por si acaso 😅

const SERIES_URL = "https://raw.githubusercontent.com/Hernan4444/public_files/main/db_series.csv"

// Editar tamaños como estime conveniente
const WIDTH_VIS_1 = 800;
const HEIGHT_VIS_1 = 250;

const WIDTH_VIS_2 = 800;
const HEIGHT_VIS_2 = 1600;

const SVG1 = d3.select("#vis-1")
  .append("svg")
  .attr("width", WIDTH_VIS_1)
  .attr("height", HEIGHT_VIS_1)

const SVG2 = d3.select("#vis-2")
  .append("svg")
  .attr("width", WIDTH_VIS_2)
  .attr("height", HEIGHT_VIS_2)
 
const MARGIN = {
    top: 70,
    bottom: 70,
    right: 30,
    left: 70, // se agranda este margen para asegurar que se vean los números
  };

// Contenedores para las visualizaciones
const contenedorVis1 = SVG1
  .append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

crearSeries();

function crearSeries() {
    /* 
    Esta función utiliza el dataset indicado en SERIES_URL para crear 
    la primera visualización.
    En esta visualización están las 3 series que deben ser dibujadas aplicando data-join 
    */
    d3.csv(SERIES_URL, d3.autoType).then(series => {
        console.log(series)
        console.log(series.map(d => d.serie))

        const rects = contenedorVis1
            .selectAll("rect")
            .data(series)
            .join(enter => {
                const rect_group = enter
                    .append("g")
                    .atrr("class", "rect-group")

                rect_group
                    .append("rect")
            })


        // No olvides actualizar los <span> con el "style" de background-color
        // según el color categórico elegido. Cada span tiene un ID único.


        /* 
        Cada vez que se haga click en un conjunto de libros. Debes llamar a
        preprocesarPersonajes(serie, false) donde "serie" 
        corresponde al nombre de la serie presionada.
    
        preprocesarPersonajes se encargará de ejecutar a crearPersonajes(...)
        */
    })



}

function crearPersonajes(dataset, serie, filtrar_dataset, ordenar_dataset) {
    // Actualizo nombre de un H4 para saber qué hacer con el dataset
    let texto = `Serie: ${serie} - Filtrar: ${filtrar_dataset} - Orden: ${ordenar_dataset}`
    d3.selectAll("#selected").text(texto);

    // Nos quedamos con los personajes asociados a la serie seleccionada
    let datos = dataset.filter(d => {
        if (serie == "Dragon Ball") {
            return d.Dragon_ball == true;
        }
        else if (serie == "Dragon Ball Z") {
            return d.Dragon_ball_z == true;
        }
        else if (serie == "Dragon Ball GT") {
            return d.Dragon_ball_gt == true;
        }
    })

    // 1. Filtrar, cuando corresponde, por poder_aumenta > 10
    // Completar aquí
    console.log(filtrar_dataset)


    // 2. Ordenar, según corresponda, los personajes. Completar aquí
    console.log(ordenar_dataset)


    // 3. Confeccionar la visualización 
    // Todas las escalas deben estar basadas en la información de "datos"
    // y NO en "dataset".

    console.log(datos)
    // No olvides que está prohibido el uso de loop (no son necesarios)
    // Y debes aplicar correctamente data-join
    // ¡Mucho éxito 😁 !
}



/* 
Código extra para reproducir música acorde a la tarea.
Si no quieres escuchar cuando se carga la página, solo cambia la línea:
let playAudio = true; por let playAudio = false;
O bien elimina todo el código que está a continuación 😅 
*/
try {
    const audio = new Audio('https://github.com/Hernan4444/public_files/raw/main/dbgt.mp3');
    audio.volume = 0.3;
    audio.loop = true;
    let playAudio = false;
    if (playAudio) {
        audio.play();
        d3.select("#sound").text("OFF Music 🎵")
    }
    d3.select("#sound").on("click", d => {
        playAudio = !playAudio;
        if (playAudio) {
            audio.play();
            d3.select("#sound").text("OFF Music 🎵")
        }
        else {
            audio.pause();
            d3.select("#sound").text("ON Music 🎵")
        }
    })
} catch (error) { };
