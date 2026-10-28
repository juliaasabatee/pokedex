// 1. Referències al DOM i array de l'equip
const miEquipo = [];
const cajaEquipo = document.getElementById('contenidor-equip');
const cajaDetalles = document.getElementById('caja-detalls');
const listaKanto = document.getElementById('lista-kanto');
const inputCercador = document.getElementById('input-cercador');
const btnCercar = document.getElementById('btn-cercar');

// 2. Funció per carregar i pintar els 151 Pokémon
async function cargarLista() {
    const respuesta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const datos = await respuesta.json();

    for (const pokemon of datos.results) {
        const cromo = document.createElement('li');
        cromo.textContent = pokemon.name.toUpperCase();

        // En fer clic al cromo, mostrem els detalls
        cromo.addEventListener('click', () => {
            mostrarDetalles(pokemon.url);
        });

        // Crear el botó d'afegir a l'equip
        const botonCapturar = document.createElement('button');
        botonCapturar.textContent = "+ Equip";

        botonCapturar.addEventListener('click', (evento) => {
            evento.stopPropagation(); // Evitem obrir detalls
            aniadirAlEquipo(pokemon);
        });

        cromo.appendChild(botonCapturar);
        listaKanto.appendChild(cromo);
    }
}

// 3. Funció per mostrar la fitxa de detalls
async function mostrarDetalles(url) {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    cajaDetalles.innerHTML = ''; // Netegem la fitxa anterior

    const nombre = document.createElement('h2');
    nombre.textContent = datos.name.toUpperCase();

    const parrafoId = document.createElement('p');
    parrafoId.textContent = "ID: #" + datos.id;

    const imagen = document.createElement('img');
    imagen.src = datos.sprites.other['official-artwork'].front_default || datos.sprites.front_default;

    const parrafoTipos = document.createElement('p');
    const tipo1 = datos.types[0].type.name;

    // Lògica tradicional amb IF per comprovar si hi ha segon tipus
    if (datos.types[1]) {
        const tipo2 = datos.types[1].type.name;
        parrafoTipos.textContent = "Tipos: " + tipo1 + ", " + tipo2;
    } else {
        parrafoTipos.textContent = "Tipo: " + tipo1;
    }

    cajaDetalles.appendChild(nombre);
    cajaDetalles.appendChild(parrafoId);
    cajaDetalles.appendChild(imagen);
    cajaDetalles.appendChild(parrafoTipos);
}

// 4. Funció per afegir a la llista de l'equip
function aniadirAlEquipo(pokemon) {
    if (miEquipo.length >= 6) {
        alert("¡Equipo lleno! El máximo permitido son 6.");
        return;
    }

    miEquipo.push(pokemon);

    const cromo = document.createElement('li');
    cromo.textContent = pokemon.name.toUpperCase();

    // Si pulsem un Pokémon dins de l'equip, també veiem la seva fitxa
    cromo.addEventListener('click', () => {
        mostrarDetalles(pokemon.url);
    });

    cajaEquipo.appendChild(cromo);
}

// 5. Funció del cercador
async function cercarPokemon() {
    const text = inputCercador.value.toLowerCase().trim();

    if (text === '') {
        alert("Si us plau, escriu el nom o número d'un Pokémon.");
        return;
    }

    const url = 'https://pokeapi.co/api/v2/pokemon/' + text;
    const respuesta = await fetch(url);

    // Si la resposta dóna error (ex: Pokémon no trobat)
    if (respuesta.ok === false) {
        alert("No s'ha trobat cap Pokémon amb aquest nom o ID!");
        return;
    }

    mostrarDetalles(url);
}

// Esdeveniment per al botó de cerca
btnCercar.addEventListener('click', cercarPokemon);

// Arrenquem l'aplicació
cargarLista();
