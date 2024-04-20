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

const contenedorVis2 = SVG2
	.append("g")

// Tooltip
let tooltip = d3.select("body").append("div")
	.style("opacity", 0)
	.style("width", 200)
	.style("height", 50)
	.style("pointer-events", "none")
	.style("background", "rgb(117, 168, 234)")
	.style("border-radius", "8px")
	.style("padding", "4px")
	.style("position", "absolute");

crearSeries();

function crearSeries() {
	/* 
	Esta función utiliza el dataset indicado en SERIES_URL para crear 
	la primera visualización.
	En esta visualización están las 3 series que deben ser dibujadas aplicando data-join 
	*/
	d3.csv(SERIES_URL, d3.autoType).then(series => {

		const datos_agrupados = d3.groups(series, d => d.serie)
		console.log(datos_agrupados)

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

		let rectangulos = contenedorVis1
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

				// Tejuelo
				rect_group
					.append("rect")
					.attr("x", (d, i) => -(100 + i * (200)))
					.attr("y", d => -220 + alturaRects1(d[1][0].personajes_extras)) // -220 + altura del rectangulo original
					.attr("width", 50)
					.attr("height", 10) // altura varía según personajes_extras
					.attr("fill", "#2644f3") // verde si es que hay manga y rojo si es que no hay manga
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

				// Tejuelo
				rect_group
					.append("rect")
					.attr("x", (d, i) => -(100 + anchoRects2(d[1][0].aventuras) + i * (200)))
					.attr("y", -220 + 120) // -220 + altura del rectangulo original
					.attr("width", d => anchoRects2(d[1][0].aventuras)) // Ancho varía según aventuras
					.attr("height", 10)
					.attr("fill", "#2644f3") // Color varía según cantidad de capítulos
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

				// Tejuelo
				rect_group
					.append("rect")
					.attr("x", (d, i) => -(150 + anchoRects2(d[1][0].aventuras) + i * (200)))
					.attr("y", d => -220 + alturaRects3(d[1][0].personajes_recurrentes))
					.attr("width", 50) // Ancho varía según aventuras
					.attr("height", 10)
					.attr("fill", "#2644f3") // Color varía según cantidad de capítulos
					.attr("stroke", "black")
					.attr("stroke-width", 2)
					.attr("id", d => `rect-${d[0].slice(-1)}`)
					.attr("transform", "rotate(180)");

				rect_group
					.append("text")
					.attr("x", (d, i) => i * 200 + 50)
					.attr("y", 230)
					.attr("font-size", "20px")
					.attr("font-weight", "bold")
					.attr("fill", (d, i) => colorRects3(i))
					.text(d => d[0]);

				return rect_group;
			},
				update => update,
				exit => exit
			);

		/* 
		Cada vez que se haga click en un conjunto de libros. Debes llamar a
		preprocesarPersonajes(serie, false) donde "serie" 
		corresponde al nombre de la serie presionada.
 
		preprocesarPersonajes se encargará de ejecutar a crearPersonajes(...)
		*/

		// Función para cuando se hace click en un grupo de rectángulos
		rectangulos.on("click", (_, dato) => {
			let serie = dato[0];

			rectangulos.selectAll(`#rect-${serie.slice(-1)}`)
				.transition("opacidad-grupo-seleccionado")
				.duration(500)
				.style("opacity", 1)

			rectangulos.selectAll("g.graph > rect")
				.transition("opacidad-grupos-aledanos")
				.duration(500)
				.style("opacity", 0.2)

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

			// Titulo de la serie
			d3.select("#detailName")
				.style("color", `${color}`)
				.style("background-color", "rgba(0, 0, 0, 0.1)")  // Esto no es tan bonito pero es para que se vean los colores
				.style("border-radius", "5px")
				.style("padding", "3px")
				.text(`  ${serie}  `)

			// Capítulos de la serie
			d3.select("#detailCaps")
				.style("color", `${color}`)
				.style("background-color", "rgba(0, 0, 0, 0.1)")
				.style("border-radius", "5px")
				.style("padding", "3px")
				.text(`${dato[1][0].cantidad_caps}`)

			// Aventuras de la serie
			d3.select("#detailAventuras")
				.style("color", `${color}`)
				.style("background-color", "rgba(0, 0, 0, 0.1)")
				.style("border-radius", "5px")
				.style("padding", "3px")
				.text(`${dato[1][0].aventuras}`)

			// Personajes recurrentes de la serie
			d3.select("#detailPersRecurrent")
				.style("color", `${color}`)
				.style("background-color", "rgba(0, 0, 0, 0.1)")
				.style("border-radius", "5px")
				.style("padding", "3px")
				.text(`${dato[1][0].personajes_recurrentes}`)

			// Personajes extras de la serie
			d3.select("#detailPersExtras")
				.style("color", `${color}`)
				.style("background-color", "rgba(0, 0, 0, 0.1)")
				.style("border-radius", "5px")
				.style("padding", "3px")
				.text(`${dato[1][0].personajes_extras}`)

			// Es basado en manga o no
			d3.select("#detailPersManga")
				.style("color", `${color}`)
				.style("background-color", "rgba(0, 0, 0, 0.1)")
				.style("border-radius", "5px")
				.style("padding", "3px")
				.text(`${dato[1][0].manga}`)

		});

		// Cambiar los colores de los span del texto
		d3.select("#legendMangaTrue").style("background-color", "green");
		d3.select("#legendMangaFalse").style("background-color", "red");
		d3.select("#legendDB").style("background-color", "#fad763");
		d3.select("#legendDBZ").style("background-color", "#8dff83");
		d3.select("#legendDBGT").style("background-color", "#db4f4b");

		/* Botones */
		d3.select("#DragonBall").on("click", () => {
			rectangulos.selectAll(`#rect-l`)
				.transition("opacidad-grupo-seleccionado")
				.duration(500)
				.style("opacity", 1);

			rectangulos.selectAll("g.graph > rect")
				.transition("opacidad-grupos-aledanos")
				.duration(500)
				.style("opacity", 0.2);

			preprocesarPersonajes("Dragon Ball", false);
		});

		d3.select("#DragonBallZ").on("click", () => {
			rectangulos.selectAll(`#rect-Z`)
				.transition("opacidad-grupo-seleccionado")
				.duration(500)
				.style("opacity", 1);

			rectangulos.selectAll("g.graph > rect")
				.transition("opacidad-grupos-aledanos")
				.duration(500)
				.style("opacity", 0.2);

			preprocesarPersonajes("Dragon Ball Z", false);
		});

		d3.select("#DragonBallGT").on("click", () => {
			rectangulos.selectAll(`#rect-T`)
				.transition("opacidad-grupo-seleccionado")
				.duration(500)
				.style("opacity", 1);

			rectangulos.selectAll("g.graph > rect")
				.transition("opacidad-grupos-aledanos")
				.duration(500)
				.style("opacity", 0.2);

			preprocesarPersonajes("Dragon Ball GT", false);
		});
	});
};

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
	//console.log(filtrar_dataset)

	// 2. Ordenar, según corresponda, los personajes: porDefecto, alfabético o poder_aumenta
	if (ordenar_dataset == "alfabético") {
		datos = d3.sort(datos, (d) => d.personaje)
	}
	else if (ordenar_dataset == "poder_aumenta") {
		datos = d3.sort(datos, (d) => d.poder_aumenta)
	}
	console.log(datos);

	// 3. Confeccionar la visualización 
	const filas = 5

	const largoBrazo = d3.scaleLog()
		.domain([1, d3.max(datos, (d) => d.poder_minimo)])
		.range([50, 400]);

	const largoCuerpo = d3.scaleLog()
		.domain([1, d3.max(datos, (d) => d.poder_promedio)])
		.range([20, 75]);

	const colorCuerpo = d3.scaleDiverging(d3.interpolatePRGn)
		.domain([d3.min(datos, d => d.aventuras),
		d3.median(datos, d => d.aventuras),
		d3.max(datos, d => d.aventuras)])

	let personajes = contenedorVis2
		.selectAll("g.personaje")
		.data(datos)
		.join(
			enter => {
				let personaje = enter.append("g")
					.attr("class", "personaje")
					.style("opacity", 0)
					.attr("transform", (_, i) => {
						let x = (i % filas) * 150 + 50; //Posición en X
						let y = Math.floor(i / filas) * 150; //Posición en Y
						return `translate(${x + 30}, ${y + 50})` //retornamos la posicion correspondiente a cada personaje
					})

				// Transición de cada personaje
				personaje
					.transition("enter-personaje")
					.duration(500)
					.style("opacity", 1)

				// Nombre de los personajes
				personaje
					.append("text")
					.attr("dominant-baseline", "top")
					.attr("text-anchor", "middle")
					.text(d => d.personaje)

				// Brazo derecho del personaje
				personaje
					.append("ellipse")
					.attr("cx", 20)
					.attr("cy", 55)
					.attr("rx", d => largoBrazo(d.poder_minimo) / 10)
					.attr("ry", 3)
					.attr("fill", "#2644f3")
					.attr("transform", "rotate(45, 20, 55)")

				// Cuadrado para tapar el sobrante edl brazo
				personaje
					.append("rect")
					.attr("x", -10)
					.attr("y", 20)
					.attr("width", 30)
					.attr("height", 30)
					.attr("fill", "#ffac8c")

				// Cabeza de los personajes
				personaje
					.append("circle")
					.attr("cx", 0)
					.attr("cy", 30)
					.attr("r", 10)
					.attr("fill", (d) => {
						if (d.primera_serie == "Dragon Ball") {
							return "#fad763"
						} else if (d.primera_serie == "Dragon Ball GT") {
							return "#db4f4b"
						} else if (d.primera_serie == "Dragon Ball Z") {
							return "#8dff83"
						}
					})

				// Cuerpo superior de los personajes
				personaje
					.append("circle")
					.attr("cx", 0)
					.attr("cy", 60)
					.attr("r", 20)
					.attr("fill", (d) => {
						if (d.serie_recurrente == "Dragon Ball") {
							return "#fad763"
						} else if (d.serie_recurrente == "Dragon Ball GT") {
							return "#db4f4b"
						} else if (d.serie_recurrente == "Dragon Ball Z") {
							return "#8dff83"
						}
					})

				// Cuerpo inferior de los personajes
				personaje
					.append("rect")
					.attr("x", -20)
					.attr("y", 60)
					.attr("width", 40)
					.attr("height", d => largoCuerpo(d.poder_promedio))
					.attr("fill", d => colorCuerpo(d.aventuras))

				// Implementación del tooltip para cada uno
				personaje
					.on("mouseover", (event, d) => {
						// Mostrar el tooltip
						tooltip
							.html(`Nombre: ${d.personaje} <br>Aventuras: ${d.aventuras} 
							<br>Poder aumenta: ${d.poder_aumenta} <br>Poder mínimo: ${d.poder_minimo}
							<br>Poder promedio: ${d.poder_promedio}<br> Poder Máximo: ${d.poder_maximo}
							<br> Primera Serie: ${d.primera_serie}<br>Serie recurrente: ${d.serie_recurrente} <br>`)
							.style("opacity", 1)
							.style("left", (event.pageX + 10) + "px")
							.style("top", (event.pageY - 28) + "px");
					}).on("mouseout", (event, d) => {
						// cuando el mouse sale del rect, desaparece tooltip
						tooltip.style("opacity", 0);
					})

				/*// Cambio de opacidad
				personaje
					.on("mouseenter", (_, d) => {
						contenedorVis2
							.selectAll("g.personaje")
							// nos quedamos con el glifo al cual el mouse entró
							.filter(dato => dato.id == d.id)
							// Hacemos la transición para que se esconda el glifo
							.transition("escoder_personajes")
							.duration(500)
							.style("opacity", 0.1)
					})
					// Al salir del mouse, dejamos el glifo como estaba antes
					.on("mouseleave", (_, d) => {
						contenedorVis2
							.selectAll("g.personaje")
							.filter(dato => dato.id == d.id)
							.transition("aparecer_personajes")
							.duration(500)
							.style("opacity", 1) 
					})
					*/
				return personaje;
			},
			update => {
				update
					.transition("update_personaje")
					.duration(500)
					.attr("transform", (_, i) => {
						let x = (i % filas) * 150 + 50;
						let y = Math.floor(i / filas) * 150;
						return `translate(${x + 30}, ${y + 50})`
					})
				return update
			},
			exit => {
				exit.attr("class", "delete")

				exit
				  .transition("exit_personaje")
					.duration(500)
					.style("opacity", 0)
					.attr("transform", (_, i) => {
						let x = (i % filas) * 150 + 50;
						let y = Math.floor(i / filas) * 150;
						return `translate(${x + 30}, ${y + 50}) scale(5)`
					})
				exit.transition("eliminar").delay(500).remove();
			}
		)
	return personajes;
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
