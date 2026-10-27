// ==========================================================================
// Examen Parcial Enginyeria de Llocs Web - PokeAPI Kanto
// ==========================================================================

// Estructura per emmagatzemar l'equip de Pokémon (Màxim 6)
const elTeuEquip = [];

// Selecció dels elements principals del DOM
const llistaKantoUI = document.getElementById('llista-kanto');
const cajaDetallsUI = document.getElementById('caja-detalls');
const contenidorEquipUI = document.getElementById('contenidor-equip');
const comptadorEquipUI = document.getElementById('comptador-equip');
const inputCercador = document.getElementById('input-cercador');
const btnCercar = document.getElementById('btn-cercar');
const btnAleatori = document.getElementById('btn-aleatori');
const missatgeError = document.getElementById('missatge-error');

// Diccionari de traducció i colors de tipus per a millor maquetació
const TIPUS_MAP = {
    grass: 'Planta', fire: 'Foc', water: 'Aigua', bug: 'Bestiola',
    normal: 'Normal', poison: 'Verí', electric: 'Elèctric', ground: 'Terra',
    fairy: 'Fada', fighting: 'Lluita', psychic: 'Psíquic', rock: 'Roca',
    ghost: 'Fantasma', ice: 'Gel', dragon: 'Drac', steel: 'Acer'
};

// ==========================================================================
// 1. Càrrega Inicial: Llista dels 151 Pokémon de Kanto (2.5 Punts)
// ==========================================================================
async function carregarPokedexKanto() {
    try {
        // Petició GET per als 151 Pokémon
        const resposta = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        if (!resposta.ok) throw new Error('No s'ha pogut carregar la llista de Kanto');
        const dades = await resposta.json();

        llistaKantoUI.innerHTML = ''; // Netejar el missatge de càrrega

        // Per a cada Pokémon de la llista
        for (const item of dades.results) {
            // Per obtenir la imatge i tipus de la llista ràpidament
            const resDetall = await fetch(item.url);
            const detall = await resDetall.json();

            // Crear la targeta de la llista
            const targeta = crearTargetaPokemonLlista(detall);
            llistaKantoUI.appendChild(targeta);
        }
    } catch (error) {
        console.error("Error en carregar Kanto:", error);
        mostrarError("Error en connectar amb la PokéAPI. Comprova la teva connexió.");
    }
}

// Crear la targeta HTML per a un Pokémon de la llista
function crearTargetaPokemonLlista(pokemon) {
    const card = document.createElement('div');
    card.className = 'pokemon-card';

    // Nom, ID i Imatge (official-artwork)
    const pokeId = `#${String(pokemon.id).padStart(3, '0')}`;
    const fotoUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

    // Badges de tipus
    const htmlTipus = pokemon.types.map(t => 
        `<span class="type-badge type-${t.type.name}">${TIPUS_MAP[t.type.name] || t.type.name}</span>`
    ).join('');

    card.innerHTML = `
        <span class="poke-id">${pokeId}</span>
        <img src="${fotoUrl}" alt="${pokemon.name}" loading="lazy" />
        <h3 class="poke-name">${pokemon.name}</h3>
        <div class="types-container">${htmlTipus}</div>
        <button class="btn-add-team">➕ Afegir a l'equip</button>
    `;

    // Event 1: Fer clic a la targeta per veure detalls
    card.addEventListener('click', () => {
        mostrarDetallsPokemon(pokemon);
    });

    // Event 2: Fer clic al botó d'afegir a l'equip
    const btnAfegir = card.querySelector('.btn-add-team');
    btnAfegir.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que obri els detalls quan es clica el botó
        afegirAEquip(pokemon);
    });

    return card;
}

// ==========================================================================
// 2. Detalls del Pokémon al Fer Clic o Cerca (1.5 Punts + Toc Extra 1 Pt)
// ==========================================================================
async function mostrarDetallsPokemon(pokemon) {
    ocultarError();
    
    const pokeId = `#${String(pokemon.id).padStart(3, '0')}`;
    const fotoUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

    // Badges de tipus
    const htmlTipus = pokemon.types.map(t => 
        `<span class="type-badge type-${t.type.name}">${TIPUS_MAP[t.type.name] || t.type.name}</span>`
    ).join('');

    // Extra: Estadístiques de combat (HP, Attack, Defense, Speed)
    const statsHtml = pokemon.stats.map(s => {
        const val = s.base_stat;
        const percent = Math.min(100, (val / 150) * 100);
        return `
            <div class="stat-bar-group">
                <span class="stat-name">${s.stat.name.toUpperCase()}</span>
                <span class="stat-val">${val}</span>
                <div class="stat-bar-bg">
                    <div class="stat-bar-fill" style="width: ${percent}%;"></div>
                </div>
            </div>
        `;
    }).join('');

    cajaDetallsUI.innerHTML = `
        <span class="poke-id-large">${pokeId}</span>
        <h2 class="poke-title">${pokemon.name}</h2>
        <img class="main-img" src="${fotoUrl}" alt="${pokemon.name}" />
        <div class="types-container" style="justify-content: center; margin: 10px 0;">${htmlTipus}</div>
        
        <button class="btn btn-primary btn-add-team-detall" style="margin: 10px 0;">➕ Afegir ${pokemon.name} a l'equip</button>
        
        <!-- FUNCIONALITAT EXTRA (1 PT): Estadístiques de combat i Cadenes d'Evolució -->
        <div class="stats-container">
            <h4>Estadístiques Base</h4>
            ${statsHtml}
        </div>

        <div id="seccio-evolucions" class="evolution-section">
            <h4>Línia Evolutiva</h4>
            <p class="placeholder-text" style="font-size:0.8rem;">Cercant evolucions...</p>
        </div>
    `;

    // Event al botó de la targeta de detalls
    const btnAddDetall = cajaDetallsUI.querySelector('.btn-add-team-detall');
    btnAddDetall.addEventListener('click', () => afegirAEquip(pokemon));

    // Carregar la cadena d'evolució (Funcionalitat Extra de l'API)
    carregarEvolucions(pokemon.id);
}

// FUNCIONALITAT EXTRA (1 Pt): Cadenes d'evolució de l'API
async function carregarEvolucions(pokemonId) {
    const divEvo = document.getElementById('seccio-evolucions');
    try {
        // 1. Obtenir espècie
        const resSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        if (!resSpecies.ok) return;
        const dadesSpecies = await resSpecies.json();

        // 2. Obtenir cadena d'evolució
        const resEvo = await fetch(dadesSpecies.evolution_chain.url);
        if (!resEvo.ok) return;
        const dadesEvo = await resEvo.json();

        // 3. Recórrer l'arbre d'evolució
        const llistaEvolucions = [];
        let curr = dadesEvo.chain;

        while (curr) {
            llistaEvolucions.push(curr.species.name);
            curr = curr.evolves_to && curr.evolves_to.length > 0 ? curr.evolves_to[0] : null;
        }

        if (llistaEvolucions.length <= 1) {
            divEvo.innerHTML = `<h4>Línia Evolutiva</h4><p style="font-size:0.85rem; color:#777;">Aquest Pokémon no té evolucions.</p>`;
            return;
        }

        // Renderitzar la línia evolutiva amb fotos
        let htmlEvo = '<div class="evolution-chain">';
        for (let i = 0; i < llistaEvolucions.length; i++) {
            const nomEvo = llistaEvolucions[i];
            const resEvoPoke = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomEvo}`);
            const dadesEvoPoke = await resEvoPoke.json();
            const imgEvo = dadesEvoPoke.sprites.front_default;

            htmlEvo += `
                <div class="evo-step" onclick="carregarISelectPokemon('${nomEvo}')">
                    <img src="${imgEvo}" alt="${nomEvo}" />
                    <span>${nomEvo}</span>
                </div>
            `;

            if (i < llistaEvolucions.length - 1) {
                htmlEvo += `<span class="evo-arrow">➔</span>`;
            }
        }
        htmlEvo += '</div>';

        divEvo.innerHTML = `<h4>Línia Evolutiva</h4>${htmlEvo}`;

    } catch (e) {
        console.log("No s'han pogut carregar les evolucions:", e);
        divEvo.innerHTML = '';
    }
}

// Funció auxiliar per carregar un Pokémon directament al fer clic a una evolució
async function carregarISelectPokemon(nom) {
    try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${nom}`);
        if (res.ok) {
            const poke = await res.json();
            mostrarDetallsPokemon(poke);
        }
    } catch(e) {}
}

// ==========================================================================
// 3. Gestió de l'Equip (1.5 Punts + 1.0 Pt Equip Sempre Visible)
// ==========================================================================
function afegirAEquip(pokemon) {
    // Comprovar si ja hi ha 6 pokémon
    if (elTeuEquip.length >= 6) {
        alert("⚠️ El teu equip ja està plè! El màxim permès és de 6 Pokémon.");
        return;
    }

    // Comprovar si ja està a l'equip (evitar duplicats si es desitja)
    const jaExisteix = elTeuEquip.some(p => p.id === pokemon.id);
    if (jaExisteix) {
        alert(`⚠️ ${pokemon.name.toUpperCase()} ja forma part del teu equip.`);
        return;
    }

    // Afegir a l'array
    elTeuEquip.push(pokemon);
    actualitzarUIEquip();
}

function eliminarDeEquip(index) {
    elTeuEquip.splice(index, 1);
    actualitzarUIEquip();
}

function actualitzarUIEquip() {
    comptadorEquipUI.textContent = `${elTeuEquip.length} / 6`;

    if (elTeuEquip.length === 0) {
        contenidorEquipUI.innerHTML = `<p class="placeholder-text">Encara no has afegit cap Pokémon al teu equip. Prem "Afegir a l'equip" en qualsevol Pokémon.</p>`;
        return;
    }

    contenidorEquipUI.innerHTML = '';

    elTeuEquip.forEach((pokemon, index) => {
        const card = document.createElement('div');
        card.className = 'equip-card';

        const fotoUrl = pokemon.sprites.front_default || pokemon.sprites.other['official-artwork'].front_default;
        const htmlTipus = pokemon.types.map(t => 
            `<span class="type-badge type-${t.type.name}">${TIPUS_MAP[t.type.name] || t.type.name}</span>`
        ).join('');

        card.innerHTML = `
            <img src="${fotoUrl}" alt="${pokemon.name}" />
            <h4>${pokemon.name}</h4>
            <div class="types-container">${htmlTipus}</div>
            <button class="btn-remove-team">❌ Treure</button>
        `;

        // Eliminar de l'equip al fer clic al botó
        card.querySelector('.btn-remove-team').addEventListener('click', (e) => {
            e.stopPropagation();
            eliminarDeEquip(index);
        });

        // Ver detalls al fer clic a la targeta de l'equip
        card.addEventListener('click', () => mostrarDetallsPokemon(pokemon));

        contenidorEquipUI.appendChild(card);
    });
}

// ==========================================================================
// 4. Cercador per Nom o ID (2.5 Punts)
// ==========================================================================
async function cercarPokemon() {
    const textCerca = inputCercador.value.toLowerCase().trim();

    if (textCerca === '') {
        mostrarError("Si us plau, escriu el nom o el número d'un Pokémon.");
        return;
    }

    try {
        ocultarError();
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${textCerca}`);

        // Comprovar si no hi ha resultats (404)
        if (!resposta.ok) {
            mostrarError(`❌ No s'ha trobat cap Pokémon amb el nom o ID "${textCerca}". Comprova que estigui ben escrit.`);
            return;
        }

        const pokemon = await resposta.json();
        mostrarDetallsPokemon(pokemon);

        // Fer scroll suau cap a la secció de detalls en mòbil
        document.getElementById('seccio-detalls').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        mostrarError("Error en fer la cerca. Intenta-ho de nou.");
    }
}

// Cercar en fer clic al botó o premiar Enter
btnCercar.addEventListener('click', cercarPokemon);
inputCercador.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') cercarPokemon();
});

// Botó Sorpresa: Cerca un Pokémon de Kanto Aleatori (1 a 151)
btnAleatori.addEventListener('click', async () => {
    const idAleatori = Math.floor(Math.random() * 151) + 1;
    inputCercador.value = idAleatori;
    cercarPokemon();
});

// Gestió de missatges d'error
function mostrarError(text) {
    missatgeError.textContent = text;
    missatgeError.classList.remove('hidden');
}

function ocultarError() {
    missatgeError.classList.add('hidden');
}

// ==========================================================================
// Arrancar l'aplicació
// ==========================================================================
carregarPokedexKanto();
