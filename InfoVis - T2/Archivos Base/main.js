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
	left: 0, // se agranda este margen para asegurar que se vean los números
};

// Contenedores para las visualizaciones
const contenedorVis1 = SVG1
	.append("g")

crearSeries();

function crearSeries() {
	/* 
	Esta función utiliza el dataset indicado en SERIES_URL para crear 
	la primera visualización.
	En esta visualización están las 3 series que deben ser dibujadas aplicando data-join 
	*/
	const series = d3.csv(SERIES_URL, d3.autoType).then(series => {

		const datos_agrupados = d3.groups(series, d => d.serie)
		console.log(datos_agrupados)

		// Posición horizontal de los rectángulos
		// const escalaX = d3.scaleBand()
		//   .domain(datos_agrupados.map(d => d[0]))
		// 	.range([0, WIDTH_VIS_1])
		// 	.padding(1);

		// Mapeo de "personajes_extra" a alturas 
		const alturaRects1 = d3.scaleLinear()
			.domain([0, d3.max(series, d => d.personajes_extras)])
			.range([0, 100]);

		// Mapeo de "cantidad_caps" a colores
		const colorRects2 = d3.scaleLinear()
			.domain([0, d3.max(datos_agrupados, d => d[1][0].cantidad_caps)])
			.range(["#ff8826", "#ff4901"]);

		// Mapeo de "aventuras" a anchos
		const anchoRects2 = d3.scaleLinear()
			.domain([0, d3.max(datos_agrupados, d => d[1][0].aventuras)])
			.range([20, 100]);

		const alturaRects3 = d3.scaleLinear()
			.domain([0, d3.max(series, d => d.personajes_recurrentes)])
			.range([0, 100]);

		const colorRects3 = d3.scaleOrdinal()
			.domain([0, 1, 2]) // Índices para los tres rectángulos en cada grupo
			.range(["#fad763", "#db4f4b", "#8dff83"]); // Colores para cada rectángulo

		const rectangulos = contenedorVis1
			.selectAll("g.group")
			.data(datos_agrupados)
			.join(enter => {
				const rect_group = enter
					.append("g")
					.attr("class", "graph")

				// Rectángulos de la izquierda
				rect_group
					.append("rect")
					.attr("x", (d, i) => -(100 + i * (200)))
					.attr("y", -200)
					.attr("width", 50)
					.attr("height", d => alturaRects1(d[1][0].personajes_extras)) // altura varía según personajes_extras
					.attr("fill", d => d[1][0].manga ? "green" : "red") // verde si es que hay manga y rojo si es que no hay manga
					.attr("stroke", "black")
					.attr("stroke-width", 2)
					.attr("id", d => `rect-${d[0].slice(-1)}`)
					.attr("transform", "rotate(180)");

				// Rectángulos centrales
				rect_group
					.append("rect")
					.attr("x", (d, i) => -(100 + anchoRects2(d[1][0].aventuras) + i * (200)))
					.attr("y", -200)
					.attr("width", d => anchoRects2(d[1][0].aventuras)) // Ancho varía según aventuras
					.attr("height", 120)
					.attr("fill", d => colorRects2(d[1][0].cantidad_caps)) // Color varía según cantidad de capítulos
					.attr("stroke", "black")
					.attr("stroke-width", 2)
					.attr("id", d => `rect-${d[0].slice(-1)}`)
					.attr("transform", "rotate(180)");

				// Rectángulos de la derecha
				rect_group
					.append("rect")
					.attr("x", (d, i) => -(150 + anchoRects2(d[1][0].aventuras) + i * (200)))
					.attr("y", -200)
					.attr("width", 50) // Ancho varía según aventuras
					.attr("height", d => alturaRects3(d[1][0].personajes_recurrentes))
					.attr("fill", (d, i) => colorRects3(i)) // Color varía según cantidad de capítulos
					.attr("stroke", "black")
					.attr("stroke-width", 2)
					.attr("id", d => `rect-${d[0].slice(-1)}`)
					.attr("transform", "rotate(180)");

				return rect_group;
			},
				update => update,
				exit => exit
			)

		/* 
		Cada vez que se haga click en un conjunto de libros. Debes llamar a
		preprocesarPersonajes(serie, false) donde "serie" 
		corresponde al nombre de la serie presionada.
 
		preprocesarPersonajes se encargará de ejecutar a crearPersonajes(...)
		*/

		// Función para cuando se hace click en un grupo de rectángulos
		rectangulos.on("click", (_, dato) => {
			var serie = dato[0];

			rectangulos.selectAll("g.graph > rect")
				.transition("opacidad-grupos-aledanos")
				.duration(500)
				.style("opacity", 0.2)

			rectangulos.selectAll(`#rect-${serie.slice(-1)}`)
				.transition("opacidad-grupo-seleccionado")
				.duration(500)
				.style("opacity", 1)

			preprocesarPersonajes(serie, false);
		});

		// Función para cuando se pasa el mouse sobre un grupo de rectángulos	
		rectangulos.on("mouseover", (_, dato) => {
			var serie = dato[0];
			var color;

			switch (serie) {
				case "Dragon Ball":
					color = "#fad763";
					break;
				case "Dragon Ball GT":
					color = "#db4f4b";
					break;
				case "Dragon Ball Z":
					color = "#8dff83";
					break;
				default:
					color = "black";
			}

			d3.select("#detailName")
				.style("color", `${color}`)
				.style("background-color", "rgba(0, 0, 0, 0.1)")  // Esto no es tan bonito pero es para que se vean los colores
				.style("border-radius", "5px")
				.style("padding", "3px")
				.text(`  ${serie}  `)

			d3.select("#detailCaps")
				.style("color", `${color}`)
				.style("background-color", "rgba(0, 0, 0, 0.1)")
				.style("border-radius", "5px")
				.style("padding", "3px")
				.text(`${dato[1][0].cantidad_caps}`)

			d3.select("#detailAventuras")
				.style("color", `${color}`)
				.style("background-color", "rgba(0, 0, 0, 0.1)")
				.style("border-radius", "5px")
				.style("padding", "3px")
				.text(`${dato[1][0].aventuras}`)

			d3.select("#detailPersRecurrent")
				.style("color", `${color}`)
				.style("background-color", "rgba(0, 0, 0, 0.1)")
				.style("border-radius", "5px")
				.style("padding", "3px")
				.text(`${dato[1][0].personajes_recurrentes}`)

			d3.select("#detailPersExtras")
				.style("color", `${color}`)
				.style("background-color", "rgba(0, 0, 0, 0.1)")
				.style("border-radius", "5px")
				.style("padding", "3px")
				.text(`${dato[1][0].personajes_extras}`)

			d3.select("#detailPersManga")
				.style("color", `${color}`)
				.style("background-color", "rgba(0, 0, 0, 0.1)")
				.style("border-radius", "5px")
				.style("padding", "3px")
				.text(`${dato[1][0].manga}`)

		});




		d3.select("#legendMangaTrue").style("background-color", "green");
		d3.select("#legendMangaFalse").style("background-color", "red");
		d3.select("#legendDB").style("background-color", "#fad763");
		d3.select("#legendDBZ").style("background-color", "#8dff83");
		d3.select("#legendDBGT").style("background-color", "#db4f4b");



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
	// console.log(filtrar_dataset)


	// 2. Ordenar, según corresponda, los personajes. Completar aquí
	// console.log(ordenar_dataset)


	// 3. Confeccionar la visualización 
	// Todas las escalas deben estar basadas en la información de "datos"
	// y NO en "dataset".

	// console.log(datos)
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
